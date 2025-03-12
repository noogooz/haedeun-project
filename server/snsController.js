import express from "express";
import { db } from "./firebaseAdmin.js"; // ✅ Admin SDK Firestore 가져오기

const router = express.Router();

router.post("/snsPost", async (req, res) => {
  try {
    const { content } = req.body;

    // Firestore에 게시글 추가
    await db.collection("snsPosts").add({
      author: "햇님이",
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "게시글 추가 완료!" });
  } catch (error) {
    console.error("🚨 Firestore 게시글 추가 실패:", error);
    res.status(500).json({ error: "게시글 추가 실패" });
  }
});

export default router;
