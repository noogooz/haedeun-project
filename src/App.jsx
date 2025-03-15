import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { postNewStatus } from "./utils/snsUtils"; // ✅ SNS 기능 유지
import StarryBackground from "./components/StarryBackground"; // 별 배경 유지
import Moon from "./components/Moon"; // ✅ 달 추가
import Navbar from "./components/Navbar";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Chatbot from "./components/Chatbot"; // ✅ AI 챗봇 유지
import SnsFeed from "./components/SnsFeed"; // ✅ 햇님이 SNS 피드 유지

// ✅ 추가된 페이지
import HomePage from "./pages/Home"; // ✅ 원래 메인 화면
import CharactersPage from "./pages/CharactersPage"; // ✅ 캐릭터 페이지
import ChatPage from "./pages/ChatPage"; // ✅ AI 챗봇 대화 페이지

export default function App() {
  useEffect(() => {
    postNewStatus(); // ✅ 앱 실행 시 SNS 자동 업데이트 시작
  }, []);

  return (
    <Router>
      <StarryBackground />
      <Moon /> {/* ✅ 달 효과 유지 */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} /> {/* ✅ 홈 화면 (기본 페이지) */}
        <Route path="/*" element={<AnimatedRoutes />} /> {/* ✅ 기존 라우팅 유지 */}
        <Route path="/chatbot" element={<Chatbot />} /> {/* ✅ AI 챗봇 유지 */}
        <Route path="/sns" element={<SnsFeed />} /> {/* ✅ 햇님이 SNS 페이지 유지 */}

        {/* ✅ 캐릭터 소개 페이지 & AI 대화 기능 추가 */}
        <Route path="/characters" element={<CharactersPage />} /> {/* ✅ 캐릭터 소개 페이지 */}
        <Route path="/chat/:characterName" element={<ChatPage />} /> {/* ✅ AI 대화 기능 */}
      </Routes>
    </Router>
  );
}
