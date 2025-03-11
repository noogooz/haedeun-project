import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase 설정 가져오기
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Firestore에서 방명록 데이터 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, "guestbook"));
      setMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchMessages();
  }, []);

  // ✅ Firestore에 메시지 추가
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim()) return;

    const newMessage = { nickname, message, createdAt: new Date() };
    await addDoc(collection(db, "guestbook"), newMessage); // Firestore에 추가

    setMessages(prev => [...prev, newMessage]);
    setNickname("");
    setMessage("");
  };

  // ✅ Firestore에서 메시지 삭제
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "guestbook", id));
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <div className="guestbook-container">
      <h1 className="guestbook-title">📖 방명록</h1>
      <form onSubmit={handleSubmit} className="guestbook-form">
        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" className="guestbook-input" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="메시지를 입력하세요..." className="guestbook-textarea"></textarea>
        <button type="submit" className="guestbook-button">남기기 ✍️</button>
      </form>

      <div className="guestbook-messages">
        {messages.length === 0 ? (
          <p>아직 남겨진 메시지가 없습니다!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="guestbook-message">
              <p className="guestbook-nickname">🌟 {msg.nickname}</p>
              <p className="guestbook-text">{msg.message}</p>
              <button onClick={() => handleDelete(msg.id)} className="guestbook-delete">삭제 ❌</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
