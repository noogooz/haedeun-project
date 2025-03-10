import React from "react";
import { useNavigate } from "react-router-dom";

export default function CharacterCard({ name, description, isFavorite, toggleFavorite }) {
  const navigate = useNavigate();

  return (
    <div
      className="character-card"
      onClick={() => navigate(`/characters/${name}`)}
    >
      <h2>
        {name}
        <span className="favorite-star" onClick={(e) => {
          e.stopPropagation(); // ⭐ 클릭 시 상세 페이지 이동 방지
          toggleFavorite();
        }}>
          {isFavorite ? "⭐" : "☆"}
        </span>
      </h2>
      <p>{description}</p>
    </div>
  );
}
