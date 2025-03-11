import React, { useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CharacterCard = memo(({ name, description, isFavorite, toggleFavorite }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 강제로 리렌더링을 유발하여 hover 애니메이션이 첫 렌더링에서도 적용되도록 함
    document.documentElement.style.setProperty("--force-repaint", Math.random());
  }, []);

  return (
    <motion.div
      className="character-card"
      onClick={() => navigate(`/characters/${name}`)}
      whileHover={{ scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } }} // ✅ 애니메이션 속도 개선
    >
      <div className="character-content">
        <h2 className="character-name">
          {name}
          <span 
            className="favorite-star"
            onClick={(e) => {
              e.stopPropagation(); // ⭐ 클릭 시 상세 페이지 이동 방지
              toggleFavorite();
            }}
          >
            {isFavorite ? "⭐" : "☆"}
          </span>
        </h2>
        <p className="character-description">{description}</p>
      </div>
    </motion.div>
  );
});

export default CharacterCard;
