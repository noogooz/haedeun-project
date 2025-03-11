import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StarryBackground from "./components/StarryBackground"; // 별 배경
import Moon from "./components/Moon"; // ✅ 달 추가
import Navbar from "./components/Navbar";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Chatbot from "./components/Chatbot"; // ✅ AI 챗봇 추가

export default function App() {
  return (
    <Router>
      <StarryBackground />
      <Moon /> {/* ✅ 달 추가 */}
      <Navbar />
      <Routes>
        <Route path="/*" element={<AnimatedRoutes />} /> {/* ✅ 기존 라우팅 유지 */}
        <Route path="/chatbot" element={<Chatbot />} /> {/* ✅ AI 챗봇 추가 */}
      </Routes>
    </Router>
  );
}
