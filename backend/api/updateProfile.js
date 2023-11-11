import express from "express";
import { getFirestore } from "firebase-admin/firestore";
import multer from "multer";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import config from "../config/firebase.config.js";

// Firebase 초기화
initializeApp(config.firebaseConfig);

const router = express.Router();
const db = getFirestore();
const storage = getStorage();

// multer 설정
const upload = multer({ storage: multer.memoryStorage() });

router.post("/updateProfile", upload.single("fileObject"), async (req, res) => {
  try {
    const { uid, name } = req.body;
    if (!req.file) {
      return res.status(400).send({ error: "파일이 포함되어 있지 않습니다." });
    }

    const storageRef = ref(storage, `pfp/${uid}`);
    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata,
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    await db.collection("profile").doc(uid).set(
      {
        id: name,
        photoURL: downloadURL,
      },
      { merge: true },
    );

    res
      .status(200)
      .send({ message: "프로필 업데이트 성공", photoURL: downloadURL });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
