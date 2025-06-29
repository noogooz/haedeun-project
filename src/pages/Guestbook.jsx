import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { updateAffinity } from "../utils/affinityUtils";
import { getUserId } from "../utils/getUserId"; // ✨ 1. '통합 신분증'을 import 합니다.
import "./Guestbook.css";

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [sortType, setSortType] = useState("latest");
  const userId = getUserId(); // ✨ 2. 통합 ID 함수를 사용합니다.

  useEffect(() => {
    const q = query(collection(db, "guestbookMessages"), orderBy(sortType === 'latest' ? 'timestamp' : 'likes', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [sortType]);
  
  // ✨ 3. 파일 내부에 있던 별도의 getUserId 함수를 완전히 삭제했습니다.

  const handleLike = async (id) => {
    const msgRef = doc(db, "guestbookMessages", id);
    const msgDoc = messages.find(m => m.id === id);

    if (msgDoc && !msgDoc.likedBy?.includes(userId)) {
      await updateDoc(msgRef, {
        likes: increment(1),
        likedBy: [...(msgDoc.likedBy || []), userId]
      });
      if (msgDoc.userId === "character_reply") {
        const characterName = msgDoc.nickname.split(" ").pop();
        await updateAffinity(userId, characterName, 3);
      }
    }
  };

  // ✅ 기존 캐릭터 답글 로직 (그대로 유지)
  const getCharacterReply = (userMessage) => {
    const text = userMessage.toLowerCase();
    const replies = [];
    if (text.includes("안녕") || text.includes("반가워")) { replies.push({ nickname: "☀️ 햇님이", text: "우와, 안녕! 에테리아에 온 걸 환영해! 자주 놀러 와!" }); }
    if (text.includes("좋아") || text.includes("귀여워")) { replies.push({ nickname: "💖 토피트", text: "히힛, 고마워! 너도 정말 사랑스러워!" }); replies.push({ nickname: "⭐ 별님이", text: "흥, 뭐… 당연한 소리를. (고맙다는 뜻이야.)" }); }
    if (text.includes("힘들") || text.includes("지쳐")) { replies.push({ nickname: "🍵 트링이", text: "많이 힘들었구나. 따뜻한 차 한 잔 하면서 잠시 쉬어가. 괜찮아." }); }
    if (text.includes("멋있다") || text.includes("예뻐")) { replies.push({ nickname: "🌙 달님이", text: "이 세계의 아름다움을 알아봐 주다니, 당신도 별처럼 깊은 눈을 가졌군요." }); }
    if (replies.length === 0) return null;
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // ✅ 기존 메시지 등록 기능 (getUserId()만 수정)
  const submitMessage = async () => {
    if (!nickname.trim() || !message.trim()) return;
    await addDoc(collection(db, "guestbookMessages"), {
      nickname, text: message, userId, likes: 0, likedBy: [], timestamp: new Date(),
    });
    // ✅ 기존 캐릭터 자동 답글 기능 (그대로 유지)
    if (Math.random() < 0.5) {
      const reply = getCharacterReply(message);
      if (reply) {
        setTimeout(async () => {
          await addDoc(collection(db, "guestbookMessages"), {
            nickname: reply.nickname, text: reply.text, userId: "character_reply", likes: Math.floor(Math.random() * 5) + 1, likedBy: [], timestamp: new Date(),
          });
        }, 2500);
      }
    }
    setNickname("");
    setMessage("");
  };

  // ✅ 기존 메시지 삭제 기능 (그대로 유지)
  const deleteMessage = async (id, messageUserId) => {
    if (userId === messageUserId) {
      await deleteDoc(doc(db, "guestbookMessages", id));
    } else {
      alert("본인이 작성한 메시지만 삭제할 수 있습니다.");
    }
  };

  return (
    <div className="guestbook-container">
      <h2 className="guestbook-title">📖 방명록</h2>
      <div className="guestbook-sort">
        <button className={sortType === "latest" ? "active" : ""} onClick={() => setSortType("latest")}>🆕 최신순</button>
        <button className={sortType === "popular" ? "active" : ""} onClick={() => setSortType("popular")}>🔥 인기순</button>
      </div>
      <div className="guestbook-form">
        <input type="text" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} className="guestbook-input"/>
        <textarea placeholder="메시지를 입력하세요..." value={message} onChange={(e) => setMessage(e.target.value)} className="guestbook-textarea"/>
        <button onClick={submitMessage} className="guestbook-button">남기기 ✍️</button>
      </div>
      <div className="guestbook-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="guestbook-message">
            <p className="guestbook-nickname">{msg.userId === "character_reply" ? msg.nickname : `⭐ ${msg.nickname}`}</p>
            <p className="guestbook-text">{msg.text}</p>
            <div className="guestbook-actions">
              <button onClick={() => handleLike(msg.id)} className={`guestbook-like ${msg.likedBy?.includes(userId) ? "liked" : ""}`} disabled={msg.likedBy?.includes(userId)}>👍 {msg.likes || 0}</button>
              {userId === msg.userId && (<button onClick={() => deleteMessage(msg.id, msg.userId)} className="guestbook-delete">삭제 🗑</button>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}