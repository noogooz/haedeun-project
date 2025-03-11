import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const CharacterCard = memo(({ name, description, isFavorite, toggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="character-card" onClick={() => navigate(`/characters/${name}`)}>
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
    </div>
  );
});

export default CharacterCard;
