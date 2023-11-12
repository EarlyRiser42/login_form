import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Firebase 관련 초기화 및 설정
const firebaseConfig = {
    type: "service_account",
    project_id: process.env.VITE_REACT_APP_PROJECT_ID,
    private_key_id: process.env.VITE_REACT_APP_PRIVATE_KEY_ID,
    private_key: process.env.VITE_REACT_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.VITE_REACT_APP_CLIENT_EMAIL,
    client_id: process.env.VITE_REACT_APP_CLIENT_ID,
    auth_uri: process.env.VITE_REACT_APP_AUTH_URI,
    token_uri: process.env.VITE_REACT_APP_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.VITE_REACT_APP_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.VITE_REACT_APP_CLIENT_X509_CERT_URL,
    universe_domain: process.env.VITE_REACT_APP_UNIVERSE_DOMAIN
};

// Firebase 앱 초기화
if (!getApps().length) {
    initializeApp({
        credential: cert(firebaseConfig),
    });
}

exports.handler = async (event, context) => {
    // POST 요청만 허용
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const db = getFirestore();
        const { email, id, password } = JSON.parse(event.body);

        let user;
        let query = db.collection("users");

        if (email) {
            query = query.where("email", "==", email);
        } else {
            query = query.where("id", "==", id);
        }

        const snapshot = await query.get();

        if (!snapshot.empty) {
            user = snapshot.docs[0].data();
        }

        if (!user || user.password !== password) {
            return {
                statusCode: 401,
                body: JSON.stringify("잘못된 비밀번호입니다."),
            };
        }

        const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "30m",
        });
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET);

        const refreshTokenDoc = await db
            .collection("refreshTokens")
            .add({ token: refreshToken });

        return {
            statusCode: 200,
            body: JSON.stringify({
                accessToken: accessToken,
                refreshTokenId: refreshTokenDoc.id,
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify("서버 오류가 발생했습니다."),
        };
    }
};
