import React from "react";
import { Link } from "react-router-dom";
import "/src/style.css"; // ✅ 전체 스타일을 한 곳에서 관리할 경우


export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">🏠 홈</Link>
      <Link to="/characters">🎭 캐릭터</Link>
      <Link to="/world">🌎 세계관</Link>
      <Link to="/guestbook">📖 방명록</Link> {/* ✅ 방명록 버튼 추가 */}
    </nav>
  );
}
