import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import jwt from "jsonwebtoken";
import firebaseKey from "../firebaseKey.json" assert { type: "json" };
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert(firebaseKey),
  });
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

router.post("/validateToken", async (req, res) => {
  const db = getFirestore();
  const accessToken = req.body.accessToken;
  const refreshTokenId = req.body.refreshTokenId;

  try {
    // 액세스 토큰 검증
    jwt.verify(accessToken, JWT_SECRET);
    return res.status(200).send("Valid access token");
  } catch (error) {
    // 액세스 토큰이 유효하지 않을 경우
    if (refreshTokenId) {
      const refreshTokenRecord = await db
        .collection("refreshTokens")
        .doc(refreshTokenId)
        .get();

      if (!refreshTokenRecord.exists) {
        return res.status(400).send("Invalid refresh token");
      }

      const refreshToken = refreshTokenRecord.data().token;

      try {
        const decodedToken = jwt.verify(refreshToken, REFRESH_SECRET);
        const userId = decodedToken.userId;

        const newAccessToken = jwt.sign({ userId: userId }, JWT_SECRET, {
          expiresIn: "30m",
        });

        return res.status(200).json({ accessToken: newAccessToken });
      } catch (error) {
        return res.status(400).send("Invalid refresh token");
      }
    } else {
      return res
        .status(400)
        .send("Invalid access token and no refresh token provided");
    }
  }
});

export default router;
