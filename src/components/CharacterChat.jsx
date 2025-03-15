import React, { useState, useEffect } from "react";
import { sendMessageToOpenAI, getPreviousMessages } from "../utils/chatUtils";

export default function CharacterChat({ character, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // ✅ Firestore에서 이전 대화 불러오기
    const loadPreviousMessages = async () => {
      const previousMessages = await getPreviousMessages(userId, character);
      setMessages(previousMessages);
    };

    loadPreviousMessages();
  }, [character, userId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const botResponse = await sendMessageToOpenAI(input, character, userId);
    const botMessage = { sender: character, text: botResponse };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h2>{character}와 대화하기</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
}
