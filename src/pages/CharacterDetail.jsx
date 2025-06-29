import React, { useState, useEffect } from "react"; // useState와 useEffect를 import 합니다.
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import characters from "../data/characters.json";
import { getAffinity } from "../utils/affinityUtils"; // 호감도 조회 함수 import
import { getUserId } from "../utils/getUserId"; // userId를 가져오는 함수 (새로 만듭니다)
import "../styles/CharacterDetail.css";

export default function CharacterDetail() {
  const { name } = useParams();
  const character = characters.find((char) => char.name === name);
  const [currentAffinity, setCurrentAffinity] = useState(0); // ✨ 1. 호감도를 저장할 state
  const userId = getUserId();

  // ✨ 2. 페이지가 로드될 때 호감도를 불러오는 useEffect
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
  
  const affinityLevel = Math.floor(currentAffinity / 50) + 1; // 50점마다 1레벨 상승

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
          
          {/* ✨ 3. 호감도 레벨 및 점수 표시 */}
          <div className="affinity-display">
            <div className="affinity-level">Lv. {affinityLevel}</div>
            <div className="affinity-bar-background">
              <motion.div 
                className="affinity-bar-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${(currentAffinity % 50) * 2}%` }} // 50점 만점 기준으로 채움
              ></motion.div>
            </div>
            <div className="affinity-score">{currentAffinity} / {affinityLevel * 50}</div>
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

          {/* ✨ 4. 호감도가 50점 이상일 때만 '숨겨진 이야기' 카드 표시 */}
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

           {/* 나머지 프로필 카드들 */}
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