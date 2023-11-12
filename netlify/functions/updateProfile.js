import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();

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

// Firebase Admin SDK 초기화
if (!getApps().length) {
    initializeApp({
        credential: cert(firebaseConfig),
    });
}

const db = getFirestore();

export async function handler(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { uid, name, pfpURL } = JSON.parse(event.body);

        await db.collection('profile').doc(uid).set(
            {
                id: name,
                pfpURL: pfpURL,
            },
            { merge: true },
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '프로필 업데이트 성공', pfpURL: pfpURL }),
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
}
