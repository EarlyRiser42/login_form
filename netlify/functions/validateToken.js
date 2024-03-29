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
const REFRESH_SECRET = process.env.VITE_REACT_APP_REFRESH_SECRET;

// Firebase Admin SDK 초기화
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

export async function handler(event) {
  try {
    const db = getFirestore();
    const { accessToken, refreshTokenId } = event.queryStringParameters;
    try {
      // 액세스 토큰 검증, 유저 프로필 반환
      const { userEmail: email } = jwt.verify(accessToken, JWT_SECRET);
      // 유저 프로필 가져오기
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
    } catch (accessError) {
      // 액세스 토큰이 유효하지 않을 경우
      if (refreshTokenId) {
        // db에서 refreshtokenid로 refreshtoken 존재 확인
        const refreshTokenRecord = await db
          .collection('refreshTokens')
          .doc(refreshTokenId)
          .get();

        if (!refreshTokenRecord.exists) {
          return { statusCode: 400, body: 'Invalid refresh token' };
        }

        const refreshToken = refreshTokenRecord.data().token;

        try {
          const decodedToken = jwt.verify(refreshToken, REFRESH_SECRET);
          const { userId, userEmail } = decodedToken;
          // 유저 프로필 가져오기
          const query = db.collection('users').where('email', '==', userEmail);
          const snapshot = await query.get();
          let user;
          if (!snapshot.empty) {
            user = snapshot.docs[0].data();
          }
          const newAccessToken = jwt.sign({ userId, userEmail }, JWT_SECRET, {
            expiresIn: '5m',
          });

          return {
            statusCode: 200,
            body: JSON.stringify({ accessToken: newAccessToken, user }),
            headers: { 'Content-Type': 'application/json' },
          };
        } catch (refreshError) {
          console.log('refreshError:', refreshError);
          return { statusCode: 400, body: 'Invalid refresh token' };
        }
      } else {
        return {
          statusCode: 400,
          body: 'Invalid access token and no refresh token provided',
        };
      }
    }
  } catch (error) {
    console.error('get userInfo Error: ', error);
    return { statusCode: 500, body: '서버 오류가 발생했습니다.' };
  }
}
