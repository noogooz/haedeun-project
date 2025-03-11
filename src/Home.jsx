import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css"; // ✅ 스타일 유지

export default function Home() {
  useEffect(() => {
    // ✅ iOS Safari에서 스타일 강제 적용 (흰색 배경 문제 해결)
    const introText = document.querySelector(".home-intro");
    if (introText) {
      introText.style.color = "#E0E0FF"; // ✅ 연한 푸른색 (배경과 조화롭게)
      introText.style.opacity = "1";
      introText.style.background = "transparent"; // ✅ 배경 제거
      introText.style.boxShadow = "none";
      introText.style.border = "none";
    }
  }, []);

  return (
    <div className="home-container">
      <div className="home-box"> {/* ✅ 메인 박스 유지 */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="home-title"
        >
          디자이너 김해든
        </motion.h1>

        {/* ✅ iOS에서 보이지 않는 문제 해결 */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="home-intro"
        >
          김해든은 감각적인 디자인을 통해 새로운 세상을 그려나가고, 
          우성현은 사이트 개발과 운영을 맡아 햇님이의 세계를 더욱 확장시키고 있습니다.
        </motion.p>

        <Link to="/characters">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            캐릭터 보러가기
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
