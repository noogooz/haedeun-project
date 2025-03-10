import React from "react";

export default function CharacterCard({ name, description, isFavorite, toggleFavorite }) {
  return (
    <div className="character-card">
      <h2>
        {name}
        <span className="favorite-star" onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}>
          {isFavorite ? "⭐" : "☆"}
        </span>
      </h2>
      <p>{description}</p>
    </div>
  );
}
