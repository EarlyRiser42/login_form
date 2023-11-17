import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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

export async function handler(event) {
  const dbService = getFirestore();
  const { following, userId, followingPage } = JSON.parse(event.body);
  return { statusCode: 500 };
  try {
    let query = '';

    if (followingPage) {
      query = dbService
        .collection('tweets')
        .orderBy('creatorId', 'desc')
        .orderBy('toDBAt', 'desc')
        .where('creatorId', 'in', following);
    } else {
      // 여기서 creatorId 필드를 기준으로 불평등 필터와 정렬을 동시에 수행
      query = dbService
        .collection('tweets')
        .orderBy('creatorId', 'desc')
        .orderBy('toDBAt', 'desc')
        .where('creatorId', '!=', userId);
    }

    const snapshot = await query.get();
    const tweets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return {
      statusCode: 200,
      body: JSON.stringify(tweets),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
}
