import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "../Home";
import CharactersPage from "../CharactersPage";
import CharacterDetail from "../pages/CharacterDetail";
import WorldPage from "../pages/WorldPage"; // ✅ 세계관 페이지 추가

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} // ✅ scale을 0.9 → 0.95로 변경
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }} // ✅ exit 효과를 너무 강하게 주지 않음
        transition={{ duration: 0.5, ease: "easeOut" }} // ✅ duration을 0.8 → 0.5로 단축
        style={{ width: "100%", minHeight: "100vh" }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/:name" element={<CharacterDetail />} />
          <Route path="/world" element={<WorldPage />} /> {/* ✅ 세계관 페이지 추가 */}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
