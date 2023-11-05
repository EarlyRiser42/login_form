const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const firebaseKey = require("../firebasekey.json");
var express = require("express");
var router = express.Router();

const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      type: firebaseKey.type,
      project_id: firebaseKey.project_id,
      private_key_id: firebaseKey.private_key_id,
      private_key: firebaseKey.private_key,
      client_email: firebaseKey.client_email,
      client_id: firebaseKey.client_id,
      auth_uri: firebaseKey.auth_uri,
      token_uri: firebaseKey.token_uri,
      auth_provider_x509_cert_url: firebaseKey.auth_provider_x509_cert_url,
      client_x509_cert_url: firebaseKey.client_x509_cert_url,
    }),
  });
}

router.get("/checkEmailOrId", async (req, res) => {
  try {
    const db = getFirestore();
    const { email, id } = req.query;

    let query;
    if (email) {
      query = db.collection("profile").where("email", "==", email);
    } else {
      query = db.collection("profile").where("id", "==", id);
    }

    const querySnapshot = await query.get();
    if (querySnapshot.empty) {
      return res.status(200).send({
        exists: false,
        message: "죄송합니다. 해당 계정을 찾을 수 없습니다.",
      });
    } else {
      const userData = querySnapshot.docs.map((doc) => {
        return {
          uuid: doc.id,
          ...doc.data(),
        };
      });

      return res.status(200).send({
        exists: true,
        data: userData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
