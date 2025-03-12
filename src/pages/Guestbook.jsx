import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "./Guestbook.css"; // ✅ 기존 스타일 유지

// ✅ 사용자 고유 ID 가져오기
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
  const [sortType, setSortType] = useState("latest"); // ✅ 기본 정렬: 최신순
  const userId = getUserId(); // ✅ 현재 사용자 ID 가져오기

  // ✅ Firestore에서 방명록 메시지 가져오기 (정렬 포함)
  useEffect(() => {
    const q = query(
      collection(db, "guestbookMessages"),
      orderBy(sortType === "latest" ? "timestamp" : "likes", "desc") // ✅ 정렬 방식 변경
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        likes: doc.data().likes || 0, // ✅ 기본값 0 할당 (NaN 방지)
        likedBy: doc.data().likedBy || [], // ✅ 좋아요 누른 사용자 리스트
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [sortType]); // ✅ 정렬 기준 변경 시 다시 불러오기

  // ✅ 메시지 제출 함수 (Firestore에 저장)
  const submitMessage = async () => {
    if (!nickname.trim() || !message.trim()) return;

    await addDoc(collection(db, "guestbookMessages"), {
      nickname,
      text: message,
      userId: userId, // ✅ 사용자 ID 저장
      likes: 0, // ✅ 좋아요 초기값 0
      likedBy: [], // ✅ 좋아요 누른 사용자 리스트 추가
      timestamp: new Date(),
    });

    setNickname("");
    setMessage("");
  };

  // ✅ 메시지 삭제 함수 (본인만 삭제 가능)
  const deleteMessage = async (id, messageUserId) => {
    if (userId === messageUserId) {
      await deleteDoc(doc(db, "guestbookMessages", id));
    } else {
      alert("본인이 작성한 메시지만 삭제할 수 있습니다.");
    }
  };

  // ✅ 좋아요 추가 및 취소 기능 (Firestore에 likedBy 배열 활용)
  const handleLike = async (id) => {
    const messageRef = doc(db, "guestbookMessages", id);
    const currentMessage = messages.find((msg) => msg.id === id);

    if (currentMessage) {
      const { likes, likedBy } = currentMessage;
      const isLiked = likedBy.includes(userId); // ✅ 현재 사용자가 좋아요를 눌렀는지 확인

      const newLikes = isLiked ? likes - 1 : likes + 1; // ✅ 좋아요 취소하면 -1, 추가하면 +1
      const newLikedBy = isLiked ? likedBy.filter((uid) => uid !== userId) : [...likedBy, userId];

      await updateDoc(messageRef, { likes: newLikes, likedBy: newLikedBy });
    }
  };

  return (
    <div className="guestbook-container">
      <h2 className="guestbook-title">📖 방명록</h2>

      {/* ✅ 정렬 방식 선택 버튼 */}
      <div className="guestbook-sort">
        <button className={sortType === "latest" ? "active" : ""} onClick={() => setSortType("latest")}>
          🆕 최신순
        </button>
        <button className={sortType === "popular" ? "active" : ""} onClick={() => setSortType("popular")}>
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

      {/* ✅ 메시지 목록 */}
      <div className="guestbook-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="guestbook-message">
            <p className="guestbook-nickname">⭐ {msg.nickname}</p>
            <p className="guestbook-text">{msg.text}</p>

            <div className="guestbook-actions">
              {/* ✅ 좋아요 버튼 */}
              <button
                onClick={() => handleLike(msg.id)}
                className={`guestbook-like ${msg.likedBy.includes(userId) ? "liked" : ""}`}
              >
                👍 {msg.likes}
              </button>

              {/* ✅ 삭제 버튼 (본인이 작성한 메시지만 보이도록) */}
              {userId === msg.userId && (
                <button onClick={() => deleteMessage(msg.id, msg.userId)} className="guestbook-delete">
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
