import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Netlify 환경 변수를 사용하여 Firebase 인증 정보 구성
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

export async function handler(event, context) {
  try {
    // Firestore 데이터베이스 접근
    const db = getFirestore();

    // event.body를 JSON으로 파싱
    const { email, id } = JSON.parse(event.body);

    let query;
    if (email) {
      query = db.collection('users').where('email', '==', email);
    } else {
      query = db.collection('users').where('id', '==', id);
    }

    // 사용자 데이터 조회
    const querySnapshot = await query.get();
    if (querySnapshot.empty) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          exists: false,
          message: '죄송합니다. 해당 계정을 찾을 수 없습니다.',
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    const userData = querySnapshot.docs.map((doc) => ({
      uuid: doc.id,
      ...doc.data(),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        exists: true,
        data: userData,
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}
