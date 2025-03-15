import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // ✅ 환경변수에서 API 키 가져오기
  dangerouslyAllowBrowser: true, // ✅ 브라우저에서 사용 가능하게 설정 (보안 주의)
});

/**
 * ✅ OpenAI에 메시지를 보내는 함수
 * @param {string} userMessage - 유저가 입력한 메시지
 * @param {string} characterName - 대화하는 캐릭터 이름
 * @returns {string} - OpenAI 응답 메시지
 */
export async function sendMessageToOpenAI(userMessage, characterName) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ 원하는 모델 사용 (gpt-4도 가능)
      messages: [
        { role: "system", content: `${characterName}처럼 말해주세요.` },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "⚠️ 오류가 발생했어요. 다시 시도해주세요!";
  }
}
