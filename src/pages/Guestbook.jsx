import React, { useState, useEffect } from "react";
import "/src/style.css"; // ✅ 전체 스타일을 하나로 관리할 경우


export default function Guestbook() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("guestbookMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  // ✅ 메시지 저장 & 로컬 스토리지 업데이트
  const addMessage = () => {
    if (!nickname.trim() || !message.trim()) return;
    const newMessage = { id: Date.now(), nickname, message };
    const updatedMessages = [newMessage, ...messages];

    setMessages(updatedMessages);
    localStorage.setItem("guestbookMessages", JSON.stringify(updatedMessages));
    setNickname("");
    setMessage("");
  };

  // ✅ 메시지 삭제 기능
  const deleteMessage = (id) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem("guestbookMessages", JSON.stringify(updatedMessages));
  };

  return (
    <div className="guestbook-container">
      <h1 className="guestbook-title">📖 방명록</h1>

      {/* ✅ 입력 폼 */}
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
        <button onClick={addMessage} className="guestbook-button">
          남기기 ✍
        </button>
      </div>

      {/* ✅ 저장된 메시지 목록 */}
      <div className="guestbook-messages">
        {messages.length === 0 ? (
          <p className="guestbook-empty">아직 남겨진 메시지가 없습니다!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="guestbook-message">
              <p className="guestbook-nickname">🌟 {msg.nickname}</p>
              <p className="guestbook-text">{msg.message}</p>
              <button
                onClick={() => deleteMessage(msg.id)}
                className="guestbook-delete"
              >
                삭제 🗑
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
