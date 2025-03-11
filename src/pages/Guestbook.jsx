import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase 설정 가져오기
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Guestbook() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId") || generateUserId();

  useEffect(() => {
    async function fetchMessages() {
      const querySnapshot = await getDocs(collection(db, "guestbook"));
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    }

    fetchMessages();
  }, []);

  function generateUserId() {
    const newId = `user-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", newId);
    return newId;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname || !message) return;

    await addDoc(collection(db, "guestbook"), {
      nickname,
      message,
      userId, // ✅ 본인 ID 저장
      timestamp: new Date(),
    });

    setMessages([...messages, { nickname, message, userId }]);
    setMessage("");
  };

  const handleDelete = async (id, messageUserId) => {
    if (userId !== messageUserId) {
      alert("본인이 작성한 메시지만 삭제할 수 있습니다.");
      return;
    }

    await deleteDoc(doc(db, "guestbook", id));
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <div className="guestbook-container">
      <h1 className="guestbook-title">📖 방명록</h1>
      <form onSubmit={handleSubmit} className="guestbook-form">
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="guestbook-input"
        />
        <textarea
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="guestbook-textarea"
        />
        <button type="submit" className="guestbook-button">작성</button>
      </form>
      <div className="guestbook-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="guestbook-message">
            <p className="guestbook-nickname">{msg.nickname}</p>
            <p className="guestbook-text">{msg.message}</p>
            {userId === msg.userId && ( // ✅ 본인이 작성한 메시지만 삭제 버튼 표시
              <button className="guestbook-delete" onClick={() => handleDelete(msg.id, msg.userId)}>❌ 삭제</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
