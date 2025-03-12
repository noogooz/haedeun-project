import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import OpenAI from "openai";
import "./Chatbot.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// ✅ 감정 목록과 말투 스타일 설정
const emotionStyles = {
  "😊 행복": "기분이 너무 좋아! 활기차게 말해줘!",
  "😴 피곤": "너무 졸려... 나른한 말투로 말해줘.",
  "😢 슬픔": "속상해... 우울한 느낌으로 말해줘.",
  "😡 짜증": "짜증나! 귀찮은 말투로 말해줘.",
  "😍 설렘": "두근두근! 설레는 말투로 말해줘!",
};

const emotions = Object.keys(emotionStyles);

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState("😊 행복");

  useEffect(() => {
    const changeEmotion = () => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setCurrentEmotion(randomEmotion);
    };

    changeEmotion(); // 초기 감정 설정
    const interval = setInterval(changeEmotion, 1800000); // 30분마다 변경

    return () => clearInterval(interval);
  }, []);

  // ✅ 감정에 따른 대답
  const generateEmotionResponse = (userInput) => {
    if (userInput.includes("기분 어때")) {
      return `음... 오늘은 ${currentEmotion}한 기분이야`;
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let botResponse = generateEmotionResponse(input);

    if (!botResponse) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `너는 18살의 밝고 자유분방한 여자아이 햇님이야! 
            현재 기분은 '${currentEmotion}'이야. 그러니까 '${emotionStyles[currentEmotion]}' 
            인공지능 같지 않게 친구처럼 친근하게 말해줘!` 
          },
          ...messages,
          userMessage,
        ],
      });

      botResponse = response.choices[0].message.content;
    }

    const botMessage = {
      role: "assistant",
      content: botResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    await addDoc(collection(db, "chatbotMessages"), userMessage);
    await addDoc(collection(db, "chatbotMessages"), botMessage);
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">🌞 햇님이와 대화하기</h2>
      <p className="chatbot-emotion">✨ 현재 햇님이 기분: {currentEmotion}</p>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
            <span className="message-text">{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="chatbot-input-container">
        <input
          type="text"
          placeholder="햇님이에게 질문하기..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chatbot-input"
        />
        <button onClick={sendMessage} className="chatbot-send">
          보내기
        </button>
      </div>
    </div>
  );
}
