import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ 네비게이션 추가
import AnimatedRoutes from "./components/AnimatedRoutes"; // ✅ 애니메이션 적용된 라우터
import StarryBackground from "./components/StarryBackground"; // ✅ 별 배경 추가
import MouseTrail from "./components/MouseTrail"; // ✅ 마우스 따라오는 빛 추가

export default function App() {
  return (
    <BrowserRouter>
      <StarryBackground /> {/* ✅ 반짝이는 별 배경 추가 */}
      <MouseTrail /> {/* ✅ 마우스 따라오는 빛 추가 */}
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
