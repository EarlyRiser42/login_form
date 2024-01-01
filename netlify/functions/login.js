import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createHash } from 'crypto';

dotenv.config();

const firebaseConfig = {
  type: 'service_account',
  project_id: process.env.VITE_REACT_APP_PROJECT_ID,
  private_key_id: process.env.VITE_REACT_APP_PRIVATE_KEY_ID,
  private_key: process.env.VITE_REACT_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.VITE_REACT_APP_CLIENT_EMAIL,
  client_id: process.env.VITE_REACT_APP_CLIENT_ID,
  auth_uri: process.env.VITE_REACT_APP_AUTH_URI,
  token_uri: process.env.VITE_REACT_APP_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.VITE_REACT_APP_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.VITE_REACT_APP_CLIENT_X509_CERT_URL,
  universe_domain: process.env.VITE_REACT_APP_UNIVERSE_DOMAIN,
};

// Firebase 앱 초기화
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

const JWT_SECRET = process.env.VITE_REACT_APP_JWT_SECRET;
const REFRESH_SECRET = process.env.VITE_REACT_APP_REFRESH_SECRET;

// Netlify 함수 정의
export async function handler(event) {
  // POST 요청이 아닐 경우 처리하지 않음
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const db = getFirestore();
    const body = JSON.parse(event.body);
    const { email, id, password } = body;
    let query;
    let user;
    if (email) {
      query = db.collection('users').where('email', '==', email);
    } else {
      query = db.collection('users').where('id', '==', id);
    }

    const snapshot = await query.get();
    const hashedPassword = createHash('sha256')
      .update(password + process.env.VITE_REACT_APP_BACK_HASH)
      .digest('hex');
    if (!snapshot.empty) {
      user = snapshot.docs[0].data();
    }

    if (!user || user.password !== hashedPassword) {
      return { statusCode: 201, body: '잘못된 비밀번호입니다.' };
    }

    const accessToken = jwt.sign(
      { userId: user.id, userEmail: user.email },
      JWT_SECRET,
      { expiresIn: '1s' },
    );
    const refreshToken = jwt.sign(
      { userId: user.id, userEmail: user.email },
      REFRESH_SECRET,
      { expiresIn: '30m' },
    );

    const refreshTokenDoc = await db
      .collection('refreshTokens')
      .add({ token: refreshToken });

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken,
        refreshTokenId: refreshTokenDoc.id,
        userEmail: user.email,
        userObj: { ...user },
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: '서버 오류가 발생했습니다.' };
  }
}
