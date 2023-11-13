import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

// Firebase Admin SDK 초기화
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

const JWT_SECRET = process.env.VITE_REACT_APP_JWT_SECRET;
const REFRESH_SECRET = process.env.VITE_REACT_APP_REFRESH_SECRET;

// Netlify 함수 정의
export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const db = getFirestore();
    const { userObj } = JSON.parse(event.body);

    const accessToken = jwt.sign(
      {
        userId: userObj.id,
        userEmail: userObj.email,
      },
      JWT_SECRET,
      {
        expiresIn: '30m',
      },
    );
    const refreshToken = jwt.sign(
      {
        userId: userObj.id,
        userEmail: userObj.email,
      },
      REFRESH_SECRET,
    );

    // Firestore에 사용자 데이터 추가
    await db.collection('users').doc(userObj.uid).set(userObj);

    // Firestore에 refreshTokenId 추가
    const refreshTokenDoc = await db
      .collection('refreshTokens')
      .add({ token: refreshToken });

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken,
        refreshTokenId: refreshTokenDoc.id,
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Error during signup:', error);
    return {
      statusCode: 500,
      body: '회원 가입 중 서버 오류가 발생했습니다.',
    };
  }
}
