import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import "./Guestbook.css"; // 스타일 적용

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
  const userId = getUserId(); // ✅ 현재 사용자 ID 가져오기

  // ✅ Firestore에서 방명록 메시지 가져오기
  useEffect(() => {
    const q = query(collection(db, "guestbookMessages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id, // ✅ Firestore 문서 ID 저장
        ...doc.data(),
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  // ✅ 메시지 제출 함수 (Firestore에 저장)
  const submitMessage = async () => {
    if (!nickname.trim() || !message.trim()) return;

    await addDoc(collection(db, "guestbookMessages"), {
      nickname,
      text: message,
      userId: userId, // ✅ 사용자 ID 저장
      timestamp: new Date(),
    });

    setNickname("");
    setMessage("");
  };

  // ✅ 메시지 삭제 함수 (본인 메시지만 삭제 가능)
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

            {/* ✅ 삭제 버튼 (본인이 작성한 메시지만 보이도록) */}
            {userId === msg.userId && (
              <button onClick={() => deleteMessage(msg.id, msg.userId)} className="guestbook-delete">
                삭제 🗑
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
