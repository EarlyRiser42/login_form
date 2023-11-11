import firebaseKey from "../firebaseKey.json" assert { type: "json" };
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import jwt from "jsonwebtoken";
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

router.post("/login", async (req, res) => {
  const db = getFirestore();
  const { email, id, password } = req.body;

  let query;
  if (email) {
    query = db.collection("users").where("email", "==", email);
    const snapshot = await query.get();

    const user = snapshot.docs[0].data();
    if (user.password !== password) {
      return res.status(401).send("잘못된 비밀번호입니다.");
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET);

    const refreshTokenDoc = await db
      .collection("refreshTokens")
      .add({ token: refreshToken });
    res.json({
      accessToken: accessToken,
      refreshTokenId: refreshTokenDoc.id,
    });
  } else {
    query = db.collection("users").where("id", "==", id);
    const snapshot = await query.get();

    const user = snapshot.docs[0].data();
    if (user.password !== password) {
      return res.status(401).send("잘못된 비밀번호입니다.");
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET);
    const refreshTokenDoc = await db
      .collection("refreshTokens")
      .add({ token: refreshToken });
    res.json({
      accessToken: accessToken,
      refreshTokenId: refreshTokenDoc.id,
    });
  }
});

export default router;
