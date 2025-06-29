import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import characters from "../data/characters.json";
import { getAffinity } from "../utils/affinityUtils";
import "../styles/CharacterDetail.css";

// ✨ 1. ChatPage에 있던 getUserId 함수를 여기에 그대로 복사합니다.
const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
};

export default function CharacterDetail() {
  const { name } = useParams();
  const character = characters.find((char) => char.name === name);
  const [currentAffinity, setCurrentAffinity] = useState(0);
  const userId = getUserId(); // ✨ 2. 파일 내부에 있는 함수를 사용합니다.

  useEffect(() => {
    const fetchAffinity = async () => {
      if (userId && name) {
        const affinityScore = await getAffinity(userId, name);
        setCurrentAffinity(affinityScore);
      }
    };
    fetchAffinity();
  }, [userId, name]);

  if (!character) {
    return <div className="detail-container"><h2>캐릭터를 찾을 수 없습니다.</h2></div>;
  }

  const { image, description, details, themeClass } = character;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const affinityLevel = Math.floor(currentAffinity / 50) + 1;
  const nextLevelAffinity = affinityLevel * 50;

  return (
    <motion.div 
      className={`detail-container ${themeClass || 'theme-default'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="detail-main-grid">
        <motion.div className="detail-image-section" variants={itemVariants}>
          <img src={image} alt={name} className="detail-character-image" />
          <h1 className="detail-character-name">{name}</h1>
          
          <div className="affinity-display">
            <div className="affinity-level">Lv. {affinityLevel}</div>
            <div className="affinity-bar-background">
              <motion.div 
                className="affinity-bar-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${(currentAffinity % 50) / 50 * 100}%` }}
              ></motion.div>
            </div>
            <div className="affinity-score">{currentAffinity} / {nextLevelAffinity}</div>
          </div>

          <p className="detail-character-description">{description}</p>
          <Link to={`/chat/${name}`} className="detail-chat-button">
            💬 {name}와 대화 시작하기
          </Link>
        </motion.div>

        <motion.div className="detail-info-section" variants={containerVariants}>
          <motion.div className="info-card" variants={itemVariants}>
            <h3 className="info-card-title">대표 대사</h3>
            <p className="quote-text">"{details.quote}"</p>
          </motion.div>
          
          {currentAffinity >= 50 ? (
            <motion.div className="info-card story-card" variants={itemVariants}>
              <h3 className="info-card-title">✨ 숨겨진 이야기</h3>
              <p>{details.story}</p>
            </motion.div>
          ) : (
            <motion.div className="info-card locked-card" variants={itemVariants}>
                <h3 className="info-card-title">🔒 숨겨진 이야기</h3>
                <p>{name}와(과)의 호감도가 50 이상이 되면 열립니다.</p>
            </motion.div>
          )}

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
        </motion.div>
      </div>
    </motion.div>
  );
}