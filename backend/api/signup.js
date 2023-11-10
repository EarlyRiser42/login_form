const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const firebaseKey = require("../firebaseKey.json");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseKey),
  });
}

// Get Firestore database
const db = getFirestore();

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

app.post("/signup", async (req, res) => {
  // 유저 id, password db 업로드
  const userObj = req.body.userObj;
  const profileObj = req.body.profileObj;
  const accessToken = jwt.sign({ userId: userObj.id }, JWT_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign({ userId: userObj.id }, REFRESH_SECRET);

  try {
    // Firestore에 사용자 데이터 추가
    const userDocRef = await db.collection("users").add(userObj);

    // Firestore에 프로필 생성
    const profileDocRef = await db.collection("profile").add(profileObj);

    // Firestore에 refreshTokenId 추가
    const refreshTokenDoc = await db
      .collection("refreshTokens")
      .add({ token: refreshToken });

    // 성공 응답 보내기
    res.json({
      accessToken: accessToken,
      refreshTokenId: refreshTokenDoc.id,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("회원 가입 중 서버 오류가 발생했습니다.");
  }
});

module.exports = app;
