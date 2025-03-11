import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css"; // ✅ 스타일 적용

export default function Home() {
  const playSound = () => {
    const audio = new Audio("/7091f8__pixabay__soft-wind-chime.wav");
    audio.volume = 0.2;
    audio.play();
  };

  return (
    <div className="home-container">
      <div className="home-box"> {/* ✅ 네모 박스 유지 */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="home-title"
        >
          디자이너 김해든
        </motion.h1>

        {/* ✅ 소개 박스를 감싸는 컨테이너 추가 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="home-intro-box"
        >
          <p className="home-intro">
            김해든은 감각적인 디자인을 통해 새로운 세상을 그려나가고, 
            우성현은 사이트 개발과 운영을 맡아 햇님이의 세계를 더욱 확장시키고 있습니다.
          </p>
        </motion.div>

        <Link to="/characters">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            onClick={playSound}  
          >
            캐릭터 보러가기
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
