import React, { useEffect, useState } from "react";
import "../style.css"; // ✅ 스타일 적용

export default function WorldPage() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="world-container">
      {/* ✅ 패럴랙스 배경 */}
      <div
        className="parallax-bg"
        style={{
          transform: `translateY(${offsetY * 0.5}px)`, // ✅ 패럴랙스 효과 적용
        }}
      ></div>

      <div className="world-content">
        <h1>🌌 세계관</h1>
        <p>이곳은 캐릭터들이 살아가는 세계를 설명하는 공간입니다.</p>
        <p>현재 준비 중입니다. 곧 업데이트될 예정이에요!</p>
      </div>
    </div>
  );
}
