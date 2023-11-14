import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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

const JWT_SECRET = process.env.VITE_REACT_APP_JWT_SECRET;

// Firebase Admin SDK 초기화
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

export async function handler(event, context) {
  try {
    const db = getFirestore();
    const { accessToken } = event.queryStringParameters;

    try {
      // 액세스 토큰 검증
      const { userId: id, userEmail: email } = jwt.verify(
        accessToken,
        JWT_SECRET,
      );

      const query = db.collection('users').where('email', '==', email);
      const snapshot = await query.get();
      let user;
      if (!snapshot.empty) {
        user = snapshot.docs[0].data();
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          user,
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 400,
        body: 'Invalid access token',
      };
    }
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: '서버 오류가 발생했습니다.' };
  }
}
