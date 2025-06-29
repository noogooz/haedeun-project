import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import characters from "../data/characters.json";
import { listenToAffinity } from "../utils/affinityUtils"; // ✨ 2. 실시간 감지 함수 import
import { getUserId } from "../utils/getUserId";
import "../styles/CharacterDetail.css";

export default function CharacterDetail() {
  const { name } = useParams();
  const character = characters.find((char) => char.name === name);
  const [currentAffinity, setCurrentAffinity] = useState(0);
  const userId = getUserId();

  // ✨ 3. useEffect를 실시간 감지 로직으로 교체
  useEffect(() => {
    if (userId && name) {
      // 실시간으로 호감도 변경을 감지 시작
      const unsubscribe = listenToAffinity(userId, (allAffinities) => {
        const characterAffinity = allAffinities[name] || 0;
        setCurrentAffinity(characterAffinity);
      });

      // 페이지를 떠날 때, 더 이상 감지할 필요가 없으므로 리스너를 정리합니다.
      return () => unsubscribe();
    }
  }, [userId, name]);

  if (!character) {
    return <div className="detail-container"><h2>캐릭터를 찾을 수 없습니다.</h2></div>;
  }

  // --- (이하 나머지 코드는 이전과 모두 동일합니다. 수정할 필요 없습니다.) ---
  const { image, description, details, themeClass } = character;
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
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
              <motion.div className="affinity-bar-foreground" initial={{ width: 0 }} animate={{ width: `${(currentAffinity % 50) / 50 * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }}></motion.div>
            </div>
            <div className="affinity-score">{currentAffinity} / {nextLevelAffinity}</div>
          </div>
          <p className="detail-character-description">{description}</p>
          <Link to={`/chat/${name}`} className="detail-chat-button">💬 {name}와 대화 시작하기</Link>
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