import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">🏠 홈</Link>
        <Link to="/characters">🎭 캐릭터</Link>
        <Link to="/world">🌎 세계관</Link>
        <Link to="/guestbook">📖 방명록</Link>
      </div>
    </nav>
  );
}
