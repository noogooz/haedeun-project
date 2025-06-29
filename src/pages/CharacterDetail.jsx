import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import characters from "../data/characters.json";
import "../styles/CharacterDetail.css"; // 새로운 CSS 파일 연결

export default function CharacterDetail() {
  const { name } = useParams();
  const character = characters.find((char) => char.name === name);

  if (!character) {
    return <div className="character-detail-container"><h2>캐릭터를 찾을 수 없습니다.</h2></div>;
  }

  const { image, description, details } = character;

  // 애니메이션 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 } // 자식 요소들이 0.2초 간격으로 나타남
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="detail-main-grid">
        {/* 왼쪽: 캐릭터 이미지 */}
        <motion.div className="detail-image-section" variants={itemVariants}>
          <img src={image} alt={name} className="detail-character-image" />
          <h1 className="detail-character-name">{name}</h1>
          <p className="detail-character-description">{description}</p>
          <Link to={`/chat/${name}`} className="detail-chat-button">
            💬 {name}와 대화 시작하기
          </Link>
        </motion.div>

        {/* 오른쪽: 상세 정보 */}
        <motion.div className="detail-info-section" variants={containerVariants}>
          <motion.div className="info-card" variants={itemVariants}>
            <h3 className="info-card-title">대표 대사</h3>
            <p className="quote-text">"{details.quote}"</p>
          </motion.div>

          <motion.div className="info-card" variants={itemVariants}>
            <h3 className="info-card-title">기본 프로필</h3>
            <ul className="profile-list">
              <li><strong>MBTI:</strong> {details.mbti}</li>
              <li><strong>출신 지역:</strong> {details.region}</li>
            </ul>
          </motion.div>
          
          <motion.div className="info-card" variants={itemVariants}>
            <h3 className="info-card-title">좋아하는 것</h3>
            <div className="tag-container">
                {details.likes.map(like => <span key={like} className="tag tag-like">{like}</span>)}
            </div>
          </motion.div>

          <motion.div className="info-card" variants={itemVariants}>
            <h3 className="info-card-title">싫어하는 것</h3>
             <div className="tag-container">
                {details.hates.map(hate => <span key={hate} className="tag tag-hate">{hate}</span>)}
            </div>
          </motion.div>

          <motion.div className="info-card story-card" variants={itemVariants}>
            <h3 className="info-card-title">배경 이야기</h3>
            <p>{details.story}</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}