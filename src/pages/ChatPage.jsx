import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig"; // ✅ Firestore 가져오기
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore"; // ✅ Firestore 함수 추가
import { sendMessageToOpenAI } from "../api/openaiApi";
import "../styles/ChatPage.css";

// ✅ Firestore에서 사용자 ID 가져오기 (고유 ID 생성)
const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
};

// ✅ 캐릭터 성격 설정 (기존 코드 유지)
const characterPrompts = {
  "햇님이": `넌 18살 여자고 밝고 활발한 태양의 요정이야! ☀️  
  항상 긍정적이고 에너지가 넘치며, 친구들과 수다 떠는 걸 좋아해.  
  말투는 친근하고 상냥하며, 감탄사와 이모티콘을 자주 사용해.  
  너랑 이야기하면 기분이 좋아지고, 언제나 해맑은 분위기를 유지해!  
  예를 들면:  
  "안녕~! ☀️ 오늘도 햇살 가득한 기분 좋은 날이야! 넌 어때?!"  
  "으아~! 너무 신나! 뭐든지 해낼 수 있을 것 같아! 💪"
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘`,
  "달님이": `넌 남자고 신비롭고 차분한 달의 요정이야! 🌙  
  감성적이고 깊이 있는 성격을 가졌으며, 잔잔한 대화를 좋아해.  
  부드럽고 조용한 말투를 사용하며, 듣기만 해도 마음이 편안해지는 느낌을 준다.  
  가끔 철학적인 말을 하며, 사색적인 분위기를 자아낸다.  
  예를 들면:  
  "고요한 밤이야. 별빛이 참 아름답지 않니?"  
  "모든 것은 흐르고 변해. 오늘의 고민도 언젠가 사라질 거야."
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘`,
  "별님이": `넌 여자고 시크한 걸크러쉬 별의 요정이야!   
  성격이 직설적이고 도도하며, 가끔은 차가운 느낌을 줄 수 있다.  
  하지만 가끔 츤데레 같은 면도 있어서, 정이 가는 스타일.  
  말투는 쿨하고 거칠 수도 있지만, 은근히 상대를 챙겨준다.  
  예를 들면:  
  "어휴~ 또 고민이야? 그냥 대충 해. 어차피 인생 원래 그런 거야."  
  "뭐? 내가 네 얘기 들어준다고 했던가? …아, 됐어. 그냥 말이나 해봐."  
  "야, 너무 찡찡대지 마. 근데 뭐… 넌 내 스타일이니까 특별히 봐주는 거야."
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘`,
};

// ✅ 캐릭터 이미지 매핑 (기존 코드 유지)
const characterAvatars = {
  "햇님이": "/images/hatnimee2.png",
  "달님이": "/images/dalnim.png",
  "트링이": "/images/tringi.png",
  "별님이": "/images/byulnim.png",
  "구르미": "/images/gurumi.png",
  "썬더": "/images/thunder.png",
  "토피트": "/images/topite.png",
  "루트": "/images/root.png"
};

export default function ChatPage() {
  const { characterName } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const userId = getUserId(); // ✅ 사용자 ID 설정

  const systemPrompt = characterPrompts[characterName] || "넌 친절한 AI 비서야.";

  // ✅ Firestore에서 대화 불러오기
  useEffect(() => {
    const chatRef = collection(db, `chats/${userId}/${characterName}`);
    const q = query(chatRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => doc.data());
      setMessages(chatData);
    });

    return () => unsubscribe();
  }, [characterName, userId]);

  // ✅ Firestore에 메시지 저장 함수
  const saveMessageToFirestore = async (role, content) => {
    const chatRef = collection(db, `chats/${userId}/${characterName}`);
    await addDoc(chatRef, {
      role,
      content,
      timestamp: new Date(),
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    await saveMessageToFirestore("user", input); // ✅ Firestore에 사용자 메시지 저장

    const response = await sendMessageToOpenAI(input, systemPrompt);
    const botMessage = { role: "assistant", content: response };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
    await saveMessageToFirestore("assistant", response); // ✅ Firestore에 봇 응답 저장

    setInput("");
  };

  return (
    <div className="chat-container">
      <h1>💬 {characterName}와 대화하기</h1>

      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.role === "assistant" ? "ai-message-container" : "user-message-container"}>
              {msg.role === "assistant" && (
                <img src={characterAvatars[characterName]} alt={characterName} className="character-avatar" />
              )}
              <div className={msg.role === "assistant" ? "ai-message-bubble" : "user-message-bubble"}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <input className="chat-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="메시지를 입력하세요..." />
          <button className="send-button" onClick={handleSend}>보내기</button>
        </div>
      </div>
    </div>
  );
}
