import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, where } from "firebase/firestore";
import OpenAI from "openai"; // ✅ OpenAI 가져오기
import "./Chatbot.css";

// ✅ OpenAI 객체 생성 (API 키 설정)
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// ✅ 사용자의 고유 ID 가져오기 (없다면 새로 생성)
const getUserId = () => {
  let userId = localStorage.getItem("chatUserId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chatUserId", userId);
  }
  return userId;
};

export default function Chatbot() {
  const [messages, setMessages] = useState([]); // 대화 저장
  const [input, setInput] = useState(""); // 입력 값
  const [currentEmotion, setCurrentEmotion] = useState("😊 행복"); // 기본 감정
  const userId = getUserId(); // ✅ 현재 사용자 ID 가져오기

  // 감정 목록
  const emotions = ["😊 행복", "😴 피곤", "😢 슬픔", "😡 짜증", "😍 설렘"];

  // ✅ Firestore에서 본인 메시지만 가져오기
  useEffect(() => {
    const q = query(
      collection(db, "chatbotMessages"),
      where("userId", "==", userId), // 🔥 본인 메시지만 가져오기
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id, // ✅ Firestore 문서 ID 저장
        ...doc.data(),
      }));
      setMessages(newMessages);
    });

    // ✅ 30분마다 감정 상태 변경 (랜덤)
    const interval = setInterval(() => {
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 1800000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [userId]);

  // ✅ 감정 기반 응답 처리
  const generateEmotionResponse = (userInput) => {
    if (userInput.includes("기분 어때")) {
      return `음... 오늘은 ${currentEmotion}한 기분이야! 😆`;
    }
    return null;
  };

  // ✅ 선물 반응 추가
  const generateGiftResponse = (userInput) => {
    if (userInput.includes("선물")) return "선물? 우와! 너무 고마워! 🎁";
    if (userInput.includes("쿠키")) return "와~ 쿠키 좋아하는데! 🍪";
    if (userInput.includes("꽃")) return "헉 꽃이라니! 너 완전 센스쟁이잖아! 🌸";
    return null;
  };

  // ✅ 메시지 보내기 함수
  const sendMessage = async () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      role: "user",
      content: input,
      userId: userId, // ✅ 사용자 ID 저장
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let botResponse = generateGiftResponse(input) || generateEmotionResponse(input);

    if (!botResponse) {
      // OpenAI API 호출 (햇님이 말투 설정)
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "너는 18살의 밝고 자유분방한 여자아이 햇님이야! 반말을 사용하고, 친구처럼 친근하게 말해줘!" },
            ...messages,
            userMessage,
          ],
        });
        botResponse = response.choices[0]?.message?.content || "응? 다시 말해줄래?";
      } catch (error) {
        console.error("🚨 OpenAI API 오류:", error);
        botResponse = "앗, 지금 잠깐 연결이 안 되나 봐! 😢 나중에 다시 말해줘!";
      }
    }

    // 햇님이 답변 저장
    const botMessage = {
      role: "assistant",
      content: botResponse,
      userId: userId, // ✅ 사용자 ID 저장 (본인만 볼 수 있도록)
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);

    // Firestore에 저장
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
