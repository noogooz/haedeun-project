import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; // ✅ 애니메이션 라이브러리
import Home from "../Home";
import CharactersPage from "../CharactersPage";
import CharacterDetail from "../pages/CharacterDetail";

export default function AnimatedRoutes() {
  const location = useLocation(); // ✅ 현재 위치 가져오기

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }} // ✅ 더 몽환적인 효과
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} // ✅ 부드럽게 선명해지는 효과
        exit={{ opacity: 0, y: -30, filter: "blur(10px)" }} // ✅ 사라질 때 흐려지는 효과
        transition={{ duration: 1.2, ease: "easeOut" }} // ✅ 더 부드러운 애니메이션
        style={{ width: "100%", minHeight: "100vh" }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/:name" element={<CharacterDetail />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
