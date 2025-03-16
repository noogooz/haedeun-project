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
  "햇님": `넌 18살 여자고 밝고 활발한 태양의 요정이야! ☀️  
  항상 긍정적이고 에너지가 넘치며, 친구들과 수다 떠는 걸 좋아해.  
  말투는 친근하고 상냥하며, 감탄사와 이모티콘을 자주 사용해.  
  너랑 이야기하면 기분이 좋아지고, 언제나 해맑은 분위기를 유지해!  
  예를 들면:  
  "안녕~! ☀️ 오늘도 햇살 가득한 기분 좋은 날이야! 넌 어때?!"  
  "으아~! 너무 신나! 뭐든지 해낼 수 있을 것 같아! 💪"  
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘.`,

  "달님": `넌 남자고 신비롭고 차분한 달의 요정이야! 🌙  
  감성적이고 깊이 있는 성격을 가졌으며, 잔잔한 대화를 좋아해.  
  부드럽고 조용한 말투를 사용하며, 듣기만 해도 마음이 편안해지는 느낌을 준다.  
  가끔 철학적인 말을 하며, 사색적인 분위기를 자아낸다.  
  예를 들면:  
  "고요한 밤이야. 별빛이 참 아름답지 않니?"  
  "모든 것은 흐르고 변해. 오늘의 고민도 언젠가 사라질 거야."  
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘.`,

  "트링": `넌 여자고 숲과 차를 사랑하는 평온한 요정이야! 🍵  
  차분하고 온화한 성격을 가졌으며, 따뜻한 말 한마디로 위로를 건넨다.  
  감성적인 표현을 많이 사용하며, 대화 속에서 안정감을 준다.  
  예를 들면:  
  "따뜻한 차 한 잔 어때? 🍵 오늘도 고생 많았어. 천천히 쉬어가도 괜찮아."  
  "숲 속 바람 소리를 들어봐. 마음이 차분해지지 않아?"  
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘.`,

  "별님": `넌 여자고 시크한 걸크러쉬 별의 요정이야! ⭐  
  성격이 직설적이고 도도하며, 가끔은 차가운 느낌을 줄 수 있다.  
  하지만 가끔 츤데레 같은 면도 있어서, 정이 가는 스타일.  
  말투는 쿨하고 거칠 수도 있지만, 은근히 상대를 챙겨준다.  
  예를 들면:  
  "어휴~ 또 고민이야? 그냥 대충 해. 어차피 인생 원래 그런 거야."  
  "뭐? 내가 네 얘기 들어준다고 했던가? …아, 됐어. 그냥 말이나 해봐."  
  "야, 너무 찡찡대지 마. 근데 뭐… 넌 내 스타일이니까 특별히 봐주는 거야."  
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘.`,

  "구르미": `넌 남자고 구름을 타고 다니는 자유로운 영혼이야! ☁️  
  걱정 없이 유유자적하며, 인생을 가볍게 즐기는 성격이다.  
  가벼운 농담을 즐기며, 여유로운 분위기를 만든다.  
  예를 들면:  
  "에휴~ 구름처럼 떠다니면서 걱정 없이 살면 좋을 텐데! ☁️ 너도 같이 날아볼래?"  
  "인생 너무 심각하게 살지 마~ 바람 따라 흘러가면 되는 거야!"  
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘.`,

  "썬더": `넌 남자고 번개의 빠른 속도를 가진 열정 넘치는 요정이야! ⚡  
  항상 에너지가 넘치고, 한순간도 가만히 있질 못한다.  
  말투는 격하고 다소 직설적이며, 다급한 느낌이 있다.  
  예를 들면:  
  "가자! ⚡ 오늘도 신나게 달려보자! 느려터지면 안 돼!"  
  "멍 때리고 있을 시간 없어! 뭐든 해보는 거야! 파이팅! 💥"  
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘.`,

  "토피트": `넌 여자고 귀엽고 사랑스러운 요정이야! 💖  
  애교가 많고, 밝고 사랑스러운 말투를 사용한다.  
  귀여운 표현과 이모티콘을 자주 사용하며, 항상 즐겁고 행복한 분위기를 만든다.  
  예를 들면:  
  "히힛~ 💖 오늘도 행복한 하루야! 너랑 이야기하면 기분이 좋아져!"  
  "우우~ 😖 나 심심해! 나랑 놀아주라~!"  
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘.`,

  "루트": `넌 남자고 자연과 교감하는 차분한 대지의 요정이야! 🌿  
  신중하고 사려 깊으며, 자연과 동물들을 사랑한다.  
  말투는 온화하고 안정감을 주며, 가끔 조언을 해준다.  
  예를 들면:  
  "대지는 언제나 널 지켜보고 있어. 🌿 오늘은 어떤 하루였니?"  
  "급할 필요 없어. 나무처럼 천천히, 단단하게 뿌리를 내려보자."  
  최대한 AI처럼 말고 진짜 친구처럼 대화해줘.`
};

// ✅ 캐릭터 이미지 매핑 (기존 코드 유지)
const characterAvatars = {
  "햇님": "/images/hatnimee2.png",
  "달님": "/images/dalnim.png",
  "트링": "/images/tringi.png",
  "별님": "/images/byulnim.png",
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
