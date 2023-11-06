const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const jwt = require("jsonwebtoken");
const firebaseKey = require("../firebaseKey.json");
const express = require("express");
require("dotenv").config();
const router = express.Router();

const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert(firebaseKey),
  });
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

router.post("/refreshLogin", async (req, res) => {
  const db = getFirestore();
  const refreshTokenId = req.body.refreshTokenId;

  const refreshTokenRecord = await db
    .collection("refreshTokens")
    .doc(refreshTokenId)
    .get();

  if (!refreshTokenRecord.exists) {
    return res.status(401).send("Invalid refresh token");
  }

  const refreshToken = refreshTokenRecord.data().token;

  try {
    const decodedToken = jwt.verify(refreshToken, REFRESH_SECRET);

    // 사용자 ID를 리프레시 토큰에서 추출
    const userId = decodedToken.userId;

    const accessToken = jwt.sign({ userId: userId }, JWT_SECRET, {
      expiresIn: "30m",
    });
    res.json({ accessToken });
  } catch (error) {
    return res.status(401).send("Invalid refresh token");
  }
});

module.exports = router;
