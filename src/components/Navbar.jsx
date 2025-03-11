import React from "react";
import { Link } from "react-router-dom";
import "../style.css"; // ✅ 네비게이션 스타일

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">🏠 홈</Link>
      <Link to="/characters">👤 캐릭터</Link>
      <Link to="/world">🌍 세계관</Link> {/* ✅ 세계관 버튼 추가 */}
    </nav>
  );
}
