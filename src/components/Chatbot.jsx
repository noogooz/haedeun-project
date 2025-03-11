import React, { useState, useEffect } from "react";
import { saveMessageToFirestore, getPreviousMessages } from "../utils/chatUtils";
import OpenAI from "openai";
import "./Chatbot.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const emotions = ["행복", "피곤", "슬픔", "짜증", "설렘"];
  const [currentEmotion, setCurrentEmotion] = useState("행복");

  useEffect(() => {
    const fetchPreviousMessages = async () => {
      const userId = localStorage.getItem("userId") || "guest";
      const prevMessages = await getPreviousMessages(userId);
      setMessages(prevMessages);
    };
    fetchPreviousMessages();

    // ✅ 30분마다 감정 상태 변경
    const interval = setInterval(() => {
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 1800000);
    return () => clearInterval(interval);
  }, []);

  const generateEmotionResponse = (userInput) => {
    if (userInput.includes("기분 어때")) {
      return `음... 오늘은 ${currentEmotion}한 기분이야! 😆`;
    }
    return null;
  };

  const generateGiftResponse = (userInput) => {
    if (userInput.includes("선물")) return "선물? 우와! 너무 고마워! 🎁";
    if (userInput.includes("쿠키")) return "와~ 쿠키 좋아하는데! 🍪";
    if (userInput.includes("꽃")) return "헉 꽃이라니! 너 완전 센스쟁이잖아! 🌸";
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, timestamp: new Date() };
    
    // ✅ 먼저 사용자가 입력한 메시지를 화면에 추가!
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // 입력창 비우기

    let botResponse = generateGiftResponse(input) || generateEmotionResponse(input);

    if (!botResponse) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "너는 18살의 밝고 자유로운 여자아이 햇님이야. 공부는 평범하지만 명랑하고 자유분방해! 반말을 사용하고, 인공지능이라고 말하지 마! 너는 방학해서 혼자 목적지 없는 여행을 하고 있어" },
          ...messages,
          userMessage,
        ],
      });
      botResponse = response.choices[0].message.content;
    }

    const botMessage = { role: "assistant", content: botResponse, timestamp: new Date() };
    
    // ✅ 햇님이의 답변도 화면에 추가
    setMessages((prev) => [...prev, botMessage]);

    // ✅ Firestore에 저장
    await saveMessageToFirestore("guest", "user", input);
    await saveMessageToFirestore("guest", "assistant", botResponse);
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">🌞 햇님이와 대화하기</h2>

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
