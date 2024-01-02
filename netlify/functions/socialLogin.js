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

// Firebase 앱 초기화
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

const JWT_SECRET = process.env.VITE_REACT_APP_JWT_SECRET;
const REFRESH_SECRET = process.env.VITE_REACT_APP_REFRESH_SECRET;

export async function handler(event) {
  // POST 요청이 아닐 경우 처리하지 않음
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const db = getFirestore();
    const userData = JSON.parse(event.body);

    const userObj = {
      id: `${userData.email.slice(0, userData.email.indexOf('@'))}${Math.floor(
        Math.random() * 1000,
      )}`,
      email: userData.email,
      password: '',
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      backgroundImage: 'https://fakeimg.pl/600x400/?text=+',
      birthyear: '1998',
      birthmonth: '4',
      birthday: '16',
      SignupAt: userData.createdAt,
      uid: userData.uid,
      intro: '',
      following: ['3431d11c-cf44-481b-805d-0835f7e77a68'],
      follower: [],
      likes: [],
      mentions: [],
    };

    let user;
    const query = db.collection('users').where('email', '==', userData.email);

    const snapshot = await query.get();
    if (snapshot.empty) {
      // Firestore에 사용자 데이터 추가
      await db.collection('users').doc(userObj.uid).set(userObj);
      user = userObj;
    } else {
      user = snapshot.docs[0].data();
    }

    const accessToken = jwt.sign(
      { userId: user.id, userEmail: user.email },
      JWT_SECRET,
      { expiresIn: '5m' },
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
