import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* ✅ 모바일에서만 보이는 햄버거 메뉴 */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* ✅ PC에서는 항상 보이고, 모바일에서는 햄버거 메뉴 눌러야 보이도록 */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>🏠 홈</Link>
        <Link to="/characters" onClick={() => setMenuOpen(false)}>🎭 캐릭터</Link>
        <Link to="/world" onClick={() => setMenuOpen(false)}>🌎 세계관</Link>
        <Link to="/guestbook" onClick={() => setMenuOpen(false)}>📖 방명록</Link>
      
      </div>
    </nav>
  );
}
