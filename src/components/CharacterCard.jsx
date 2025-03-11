import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CharacterCard({ name, description, isFavorite, toggleFavorite }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="character-card"
      whileHover={{ scale: 1.05 }} // ✅ hover 시 부드러운 확대만 적용
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onClick={() => navigate(`/characters/${name}`)}
    >
      <h2 className="character-name">
        {name}
        <span
          className="favorite-star"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          {isFavorite ? "⭐" : "☆"}
        </span>
      </h2>
      <p className="character-description">{description || "아직 설정되지 않았어요."}</p>
    </motion.div>
  );
}
