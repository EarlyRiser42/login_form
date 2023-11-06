const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const firebaseKey = require("../firebaseKey.json");
var express = require("express");
var router = express.Router();

const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert(firebaseKey),
  });
}

router.get("/checkEmailOrId", async (req, res) => {
  try {
    const db = getFirestore();
    const { email, id } = req.query;

    let query;
    if (email) {
      query = db.collection("users").where("email", "==", email);
    } else {
      query = db.collection("users").where("id", "==", id);
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
