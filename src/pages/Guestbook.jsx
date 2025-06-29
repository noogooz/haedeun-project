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
} from "firebase/firestore";
import { updateAffinity } from "../utils/affinityUtils"; // ✨ 1. 호감도 업데이트 함수 import
import "./Guestbook.css";

const getUserId = () => {
  let userId = localStorage.getItem("guestbookUserId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("guestbookUserId", userId);
  }
  return userId;
};

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [sortType, setSortType] = useState("latest");
  const userId = getUserId();

  useEffect(() => {
    const q = query(
      collection(db, "guestbookMessages"),
      orderBy(sortType === "latest" ? "timestamp" : "likes", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        likes: doc.data().likes || 0,
        likedBy: doc.data().likedBy || [],
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [sortType]);

  const getCharacterReply = (userMessage) => {
    const text = userMessage.toLowerCase();
    const replies = [];

    if (text.includes("안녕") || text.includes("반가워") || text.includes("처음")) {
        replies.push({ nickname: "햇님이", text: "우와, 안녕! 에테리아에 온 걸 환영해! 자주 놀러 와! ☀️" });
    }
    if (text.includes("좋아") || text.includes("귀여워") || text.includes("최고") || text.includes("이뻐")) {
        replies.push({ nickname: "토피트", text: "히힛, 고마워! 너도 정말 사랑스러워! 💖" });
        replies.push({ nickname: "별님이", text: "흥, 뭐… 당연한 소리를. (고맙다는 뜻이야.)" });
    }
    if (text.includes("힘들") || text.includes("지쳐") || text.includes("슬퍼")) {
        replies.push({ nickname: "트링이", text: "많이 힘들었구나. 따뜻한 차 한 잔 하면서 잠시 쉬어가. 괜찮아. 🍵" });
    }
    if (text.includes("멋있다") || text.includes("예뻐") || text.includes("세계관")) {
        replies.push({ nickname: "달님이", text: "이 세계의 아름다움을 알아봐 주다니, 당신도 별처럼 깊은 눈을 가졌군요." });
    }

    if (replies.length === 0) return null;
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const submitMessage = async () => {
    if (!nickname.trim() || !message.trim()) return;

    await addDoc(collection(db, "guestbookMessages"), {
      nickname,
      text: message,
      userId: userId,
      likes: 0,
      likedBy: [],
      timestamp: new Date(),
    });

    if (Math.random() < 0.5) {
      const reply = getCharacterReply(message);
      if (reply) {
        setTimeout(async () => {
          await addDoc(collection(db, "guestbookMessages"), {
            nickname: reply.nickname,
            text: reply.text,
            userId: "character_reply",
            likes: Math.floor(Math.random() * 5) + 1,
            likedBy: [],
            timestamp: new Date(),
          });
        }, 2500);
      }
    }

    setNickname("");
    setMessage("");
  };

  const deleteMessage = async (id, messageUserId) => {
    if (userId === messageUserId) {
      await deleteDoc(doc(db, "guestbookMessages", id));
    } else {
      alert("본인이 작성한 메시지만 삭제할 수 있습니다.");
    }
  };

  // ✨ 2. '좋아요' 기능에 호감도 업데이트 로직 추가
  const handleLike = async (id) => {
    const messageRef = doc(db, "guestbookMessages", id);
    const currentMessage = messages.find((msg) => msg.id === id);

    if (currentMessage) {
      const { likes, likedBy, userId: authorId, nickname: authorNickname } = currentMessage;
      const isLiked = likedBy.includes(userId);

      if (isLiked) return; // 이미 좋아요를 눌렀으면 아무것도 하지 않음

      const newLikes = likes + 1;
      const newLikedBy = [...likedBy, userId];

      await updateDoc(messageRef, { likes: newLikes, likedBy: newLikedBy });

      // ✨ 3. 만약 '좋아요'를 받은 글이 캐릭터의 답글이라면, 해당 캐릭터의 호감도를 3점 올립니다.
      if (authorId === "character_reply") {
        // 닉네임에서 이모지를 제외한 순수 이름만 추출 (예: "☀️ 햇님이" -> "햇님이")
        const characterName = authorNickname.split(" ").pop();
        await updateAffinity(userId, characterName, 3);
      }
    }
  };

  return (
    <div className="guestbook-container">
      <h2 className="guestbook-title">📖 방명록</h2>

      <div className="guestbook-sort">
        <button
          className={sortType === "latest" ? "active" : ""}
          onClick={() => setSortType("latest")}
        >
          🆕 최신순
        </button>
        <button
          className={sortType === "popular" ? "active" : ""}
          onClick={() => setSortType("popular")}
        >
          🔥 인기순
        </button>
      </div>

      <div className="guestbook-form">
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="guestbook-input"
        />
        <textarea
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="guestbook-textarea"
        />
        <button onClick={submitMessage} className="guestbook-button">
          남기기 ✍️
        </button>
      </div>

      <div className="guestbook-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="guestbook-message">
            <p className="guestbook-nickname">
              {msg.userId === "character_reply" ? msg.nickname : `⭐ ${msg.nickname}`}
            </p>
            <p className="guestbook-text">{msg.text}</p>

            <div className="guestbook-actions">
              <button
                onClick={() => handleLike(msg.id)}
                className={`guestbook-like ${
                  msg.likedBy.includes(userId) ? "liked" : ""
                }`}
                disabled={msg.likedBy.includes(userId)} // 이미 눌렀으면 비활성화
              >
                👍 {msg.likes}
              </button>

              {userId === msg.userId && (
                <button
                  onClick={() => deleteMessage(msg.id, msg.userId)}
                  className="guestbook-delete"
                >
                  삭제 🗑
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}