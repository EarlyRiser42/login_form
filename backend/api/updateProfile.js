const express = require("express");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const { v4: uuidv4 } = require("uuid");
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const firebaseKey = require("../firebaseKey.json");

// Firebase 초기화
const apps = getApps();
if (!apps.length) {
  initializeApp({
    credential: cert(firebaseKey),
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET", // Firebase 스토리지 버킷 URL
  });
}

const router = express.Router();
const db = getFirestore();
const storage = getStorage();

router.post("/updateProfile", async (req, res) => {
  try {
    const { uid, photo, name } = req.body;
    const attachmentRef = storage.bucket().file(`pfp/${uuidv4()}`);
    await attachmentRef.save(Buffer.from(photo, "base64"), {
      metadata: {
        contentType: "image/png",
      },
    });

    const attachmentUrl = await attachmentRef.publicUrl();
    await db.doc(`profile/${uid}`).update({
      id: name,
      photoURL: attachmentUrl,
    });

    res.status(200).send({ message: "프로필 업데이트 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
