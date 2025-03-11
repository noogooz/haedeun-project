import React, { useEffect, useState } from "react";
import "../styles/MouseTrail.css";

export default function MouseTrail() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    // 📌 화면 크기에 따라 모바일인지 확인하는 함수
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 📌 창 크기 변경될 때 모바일인지 다시 확인
    window.addEventListener("resize", checkScreenSize);

    // 📌 마우스 움직일 때 효과 추가 (모바일 제외)
    const handleMouseMove = (e) => {
      if (!isMobile) {
        setTrail((prevTrail) => [...prevTrail, { x: e.clientX, y: e.clientY }].slice(-10));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

  if (isMobile) return null; // 📌 모바일에서는 포인터 숨기기!

  return (
    <div className="mouse-trail">
      {trail.map((dot, index) => (
        <div
          key={index}
          className="trail-dot"
          style={{ left: `${dot.x}px`, top: `${dot.y}px` }}
        />
      ))}
    </div>
  );
}
