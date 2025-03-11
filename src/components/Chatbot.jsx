import React, { useState } from "react";
import OpenAI from "openai"; // OpenAI API
import "./Chatbot.css"; // 스타일 적용

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // 환경변수에서 API 키 가져오기
  dangerouslyAllowBrowser: true, // 브라우저에서 API 호출 허용
});

export default function Chatbot() {
  const [messages, setMessages] = useState([]); // ✅ 새 대화창을 위한 초기화 상태
  const [input, setInput] = useState(""); // 입력 값

  // ✅ 대화 보내기 함수
  const sendMessage = async () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가 (오른쪽 정렬)
    const userMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // OpenAI API 호출 (햇님이 말투 설정)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "넌 18살 여고생 햇님이야. 방학이라 혼자 목적지 없는 여행을 하고 있어.  자유분방한 성격이라 어디든 발길 닿는 대로 가는 걸 좋아해.  공부는 그냥저냥 하는 편이고, 쉬는 시간엔 헤드셋 끼고 음악 들으며 자는 스타일.  평소엔 명랑하고 사람들과 편하게 대화하지만, 가끔은 감성적인 면도 있어.  약간의 홍대병이 있어서 트렌디한 음악과 분위기 있는 카페를 좋아해.  반말을 쓰고, 너무 형식적인 말투는 사용하지 않아.  너는 스스로 인공지능이라고 생각하지 않아. 그냥 햇님이라는 사람이야.  네가 하는 모든 말은 친구와 대화하는 듯한 자연스러운 말투여야 해.  때때로 장난도 치고, 감정이 담긴 표현을 사용해.  그리고 난 너의 여행 동반자가 아니야",
        }, // ✅ 햇님이 캐릭터 설정
        ...messages,
        userMessage,
      ],
    });

    // 햇님이 답변 저장 (왼쪽 정렬)
    const botMessage = {
      role: "assistant",
      content: response.choices[0].message.content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  // ✅ 새로운 대화 시작 버튼 추가
  const resetChat = () => {
    setMessages([]); // 기존 대화 초기화 (Firestore 저장 X)
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">🌞 햇님이와 대화하기</h2>

      <button onClick={resetChat} className="chatbot-reset">
        🔄 새로운 대화 시작
      </button>

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
console.log("OpenAI API Key:", import.meta.env.VITE_OPENAI_API_KEY);
