import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * ✅ OpenAI에 메시지를 보내는 함수 (수정됨)
 * @param {Array} messages - 이전 대화 기록을 포함한 메시지 배열
 * @param {string} systemPrompt - AI의 역할을 정의하는 시스템 프롬프트
 * @returns {string} - OpenAI 응답 메시지
 */
export async function sendMessageToOpenAI(messages, systemPrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // 또는 "gpt-3.5-turbo"
      messages: [
        { role: "system", content: systemPrompt }, // 1. 시스템 프롬프트(페르소나) 전달
        ...messages, // 2. 전체 대화 기록(...messages) 전달
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // 에러를 던져서 호출한 쪽에서 처리하도록 변경
    throw error;
  }
}