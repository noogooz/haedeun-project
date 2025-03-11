import React from "react";
import { BrowserRouter } from "react-router-dom";
import StarryBackground from "./components/StarryBackground"; // 별 배경
import Moon from "./components/Moon"; // ✅ 달 추가
import Navbar from "./components/Navbar";
import AnimatedRoutes from "./components/AnimatedRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <StarryBackground />
      <Moon /> {/* ✅ 달 추가 */}
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
