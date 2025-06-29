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
import "./Guestbook.css";

// 사용자 고유 ID를 가져오는 함수 (기존과 동일)
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

  // Firestore에서 방명록 메시지 가져오기 (기존과 동일)
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

  // ✨ [수정됨] 캐릭터 답글 로직을 위한 함수
  const getCharacterReply = (userMessage) => {
    const text = userMessage.toLowerCase();
    const replies = [];

    if (text.includes("안녕") || text.includes("반가워") || text.includes("처음")) {
        replies.push({ nickname: "☀️ 햇님이", text: "우와, 안녕! 에테리아에 온 걸 환영해! 자주 놀러 와!" });
    }
    if (text.includes("좋아") || text.includes("귀여워") || text.includes("최고") || text.includes("이뻐")) {
        replies.push({ nickname: "💖 토피트", text: "히힛, 고마워! 너도 정말 사랑스러워!" });
        replies.push({ nickname: "⭐ 별님이", text: "흥, 뭐… 당연한 소리를. (고맙다는 뜻이야.)" });
    }
    if (text.includes("힘들") || text.includes("지쳐") || text.includes("슬퍼")) {
        replies.push({ nickname: "🍵 트링이", text: "많이 힘들었구나. 따뜻한 차 한 잔 하면서 잠시 쉬어가. 괜찮아." });
    }
    if (text.includes("멋있다") || text.includes("예뻐") || text.includes("세계관")) {
        replies.push({ nickname: "🌙 달님이", text: "이 세계의 아름다움을 알아봐 주다니, 당신도 별처럼 깊은 눈을 가졌군요." });
    }

    if (replies.length === 0) return null;
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // ✨ [수정됨] 메시지 제출 및 캐릭터 답글 기능이 포함된 함수
  const submitMessage = async () => {
    if (!nickname.trim() || !message.trim()) return;

    // 1. 사용자 메시지 저장 (기존 로직)
    await addDoc(collection(db, "guestbookMessages"), {
      nickname,
      text: message,
      userId: userId,
      likes: 0,
      likedBy: [],
      timestamp: new Date(),
    });

    // 2. 일정 확률(50%)로 캐릭터가 답글을 남기는 로직 추가
    if (Math.random() < 0.5) {
      const reply = getCharacterReply(message);
      if (reply) {
        setTimeout(async () => {
          await addDoc(collection(db, "guestbookMessages"), {
            nickname: reply.nickname,
            text: reply.text,
            userId: "character_reply", // 시스템이 남긴 글임을 표시
            likes: Math.floor(Math.random() * 5) + 1, // 답글에는 랜덤 좋아요
            likedBy: [],
            timestamp: new Date(),
          });
        }, 2500); // 2.5초 후에 답글이 달리도록 설정
      }
    }

    setNickname("");
    setMessage("");
  };

  // 메시지 삭제 함수 (기존과 동일)
  const deleteMessage = async (id, messageUserId) => {
    if (userId === messageUserId || messageUserId === "character_reply") { // 캐릭터 답글도 삭제 가능하도록 (선택사항)
      await deleteDoc(doc(db, "guestbookMessages", id));
    } else {
      alert("본인이 작성한 메시지만 삭제할 수 있습니다.");
    }
  };

  // 좋아요 기능 (기존과 동일)
  const handleLike = async (id) => {
    const messageRef = doc(db, "guestbookMessages", id);
    const currentMessage = messages.find((msg) => msg.id === id);

    if (currentMessage) {
      const { likes, likedBy } = currentMessage;
      const isLiked = likedBy.includes(userId);

      const newLikes = isLiked ? likes - 1 : likes + 1;
      const newLikedBy = isLiked
        ? likedBy.filter((uid) => uid !== userId)
        : [...likedBy, userId];

      await updateDoc(messageRef, { likes: newLikes, likedBy: newLikedBy });
    }
  };

  // JSX 렌더링 부분 (기존과 동일)
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