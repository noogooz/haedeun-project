import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import characters from "../data/characters.json";
import { listenToAffinity } from "../utils/affinityUtils";
import { getUserId } from "../utils/getUserId"; // ✨ 1. 이 import 구문을 통해 함수를 가져옵니다.
import "../styles/CharacterDetail.css";

// ✨ 2. 파일 내부에 있던 const getUserId = () => { ... } 중복 선언을 완전히 삭제했습니다.

export default function CharacterDetail() {
  const { name } = useParams();
  const character = characters.find((char) => char.name === name);
  const [currentAffinity, setCurrentAffinity] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const userId = getUserId(); // ✨ 3. import로 가져온 함수를 사용합니다.

  useEffect(() => {
    if (userId && name) {
      const unsubscribe = listenToAffinity(userId, (allAffinities) => {
        const characterAffinity = allAffinities[name.replace(/\./g, "_")] || 0;
        setCurrentAffinity(characterAffinity);
      });
      return () => unsubscribe();
    }
  }, [userId, name]);

  if (!character) {
    return <div className="detail-container"><h2>캐릭터를 찾을 수 없습니다.</h2></div>;
  }

  const { image, description, details, themeClass } = character;
  
  const affinityLevel = Math.floor(currentAffinity / 50) + 1;
  const nextLevelAffinity = affinityLevel * 50;

  const storyUnlocked = currentAffinity >= 50;
  const secretStoryUnlocked = currentAffinity >= 120;
  const galleryUnlocked = currentAffinity >= 250;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <motion.div 
        className={`detail-container ${themeClass || 'theme-default'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
                  animate={{ width: `${(currentAffinity % 50) / 50 * 100}%` }}
                ></motion.div>
              </div>
              <div className="affinity-score">{currentAffinity} / {nextLevelAffinity}</div>
            </div>

            <p className="detail-character-description">{description}</p>
            
            <div className="button-wrapper">
                {galleryUnlocked && (
                  <motion.button 
                    className="gallery-button"
                    onClick={() => setIsGalleryOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🖼️ 갤러리 보기
                  </motion.button>
                )}
                <Link to={`/chat/${name}`} className="detail-chat-button">
                  💬 {name}와 대화 시작하기
                </Link>
            </div>
          </motion.div>

          <motion.div className="detail-info-section" variants={containerVariants}>
            <motion.div className="info-card" variants={itemVariants}>
              <h3 className="info-card-title">대표 대사</h3>
              <p className="quote-text">"{details.quote}"</p>
            </motion.div>
            
            {storyUnlocked ? (
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

            {secretStoryUnlocked ? (
              <motion.div className="info-card secret-story-card" variants={itemVariants}>
                <h3 className="info-card-title">💖 비밀 이야기</h3>
                <p>{details.secretStory}</p>
              </motion.div>
            ) : (
              <motion.div className="info-card locked-card" variants={itemVariants}>
                  <h3 className="info-card-title">🔒 비밀 이야기</h3>
                  <p>{name}와(과)의 호감도가 120 이상이 되면 열립니다.</p>
              </motion.div>
            )}
            
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

      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            className="gallery-overlay"
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            onClick={() => setIsGalleryOpen(false)}
          >
            <motion.div 
              className="gallery-content"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{name} 갤러리</h2>
              <div className="gallery-grid">
                {details.gallery.map((imgSrc, index) => (
                  <img key={index} src={imgSrc} alt={`${name} 갤러리 이미지 ${index + 1}`} />
                ))}
              </div>
              <button onClick={() => setIsGalleryOpen(false)}>닫기</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}