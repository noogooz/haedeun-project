import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "../pages/Home";
import CharactersPage from "../pages/CharactersPage";
import CharacterDetail from "../pages/CharacterDetail";
import WorldPage from "../pages/WorldPage";
import Guestbook from "../pages/Guestbook"; // ✅ 방명록 추가

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ width: "100%", minHeight: "100vh" }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/:name" element={<CharacterDetail />} />
          <Route path="/world" element={<WorldPage />} />
          <Route path="/guestbook" element={<Guestbook />} /> {/* ✅ 방명록 추가 */}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
