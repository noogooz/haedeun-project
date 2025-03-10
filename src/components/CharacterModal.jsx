import React from 'react';

export default function CharacterModal({ character, onClose }) {
  if (!character) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{character.name}</h2>
        <p>{character.description}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
