import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import characterPrompts from "../data/charactersPrompts";

// ✅ Firestore에 대화 저장
export const saveMessageToFirestore = async (userId, role, content, character) => {
  try {
    await addDoc(collection(db, "chatbotMessages"), {
      userId, // 유저별 저장
      role, // "user" 또는 "bot"
      content,
      character, // 대화하는 캐릭터 정보 추가
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Firestore 저장 오류:", error);
  }
};

// ✅ Firestore에서 이전 대화 불러오기
export const getPreviousMessages = async (userId, character) => {
  try {
    const q = query(
      collection(db, "chatbotMessages"),
      where("userId", "==", userId),
      where("character", "==", character) // 특정 캐릭터와의 대화만 가져오기
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Firestore 불러오기 오류:", error);
    return [];
  }
};

// ✅ OpenAI API 요청 함수
export async function sendMessageToOpenAI(message, character, userId) {
  try {
    const systemPrompt = characterPrompts[character] || "넌 친절한 AI 비서야.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // ✅ 환경 변수 사용
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    // ✅ Firestore에 유저 메시지 및 AI 응답 저장
    await saveMessageToFirestore(userId, "user", message, character);
    await saveMessageToFirestore(userId, "bot", botResponse, character);

    return botResponse;
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    return "오류가 발생했어요. 다시 시도해 주세요!";
  }
}
