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
  // POST 요청이 아닐 경우 처리하지 않음
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const dbService = getFirestore();
  const { following, userId, followingPage, size, page } = JSON.parse(
    event.body,
  );

  try {
    let query;
    if (followingPage) {
      query = dbService
        .collection('tweets')
        .orderBy('creatorId', 'desc')
        .orderBy('toDBAt', 'desc')
        .where('creatorId', 'in', following);
    } else {
      query = dbService
        .collection('tweets')
        .orderBy('creatorId', 'desc')
        .orderBy('toDBAt', 'desc')
        .where('creatorId', '!=', userId);
    }

    const snapshot = await query.get();
    const tweets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const totalCount = tweets.length;
    const totalPages = Math.round(totalCount / size);

    return {
      statusCode: 200,
      body: JSON.stringify({
        contents: tweets.slice(page * size, (page + 1) * size),
        pageNumber: page,
        pageSize: size,
        totalPages,
        totalCount,
        isLastPage: totalPages <= page + 1,
        isFirstPage: page === 0,
      }),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
}
