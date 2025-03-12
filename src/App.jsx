import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { postNewStatus } from "./utils/snsUtils"; // ✅ SNS 기능 추가
import StarryBackground from "./components/StarryBackground"; // 별 배경
import Moon from "./components/Moon"; // ✅ 달 추가
import Navbar from "./components/Navbar";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Chatbot from "./components/Chatbot"; // ✅ AI 챗봇 추가
import SnsFeed from "./components/SnsFeed"; // ✅ 햇님이 SNS 피드 추가

export default function App() {
  useEffect(() => {
    postNewStatus(); // ✅ 앱 실행 시 SNS 자동 업데이트 시작
  }, []);

  return (
    <Router>
      <StarryBackground />
      <Moon /> {/* ✅ 달 추가 */}
      <Navbar />
      <Routes>
        <Route path="/*" element={<AnimatedRoutes />} /> {/* ✅ 기존 라우팅 유지 */}
        <Route path="/chatbot" element={<Chatbot />} /> {/* ✅ AI 챗봇 추가 */}
        <Route path="/sns" element={<SnsFeed />} /> {/* ✅ 햇님이 SNS 페이지 추가 */}
      </Routes>
    </Router>
  );
}
