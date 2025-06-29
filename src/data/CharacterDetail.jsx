import React from "react";
import { useParams } from "react-router-dom";
import CharacterChat from "../components/CharacterChat";
import characterData from "../data/characters.json";

export default function CharacterDetail() {
  const { name } = useParams();
  const character = characterData.find((char) => char.name === name);

  if (!character) {
    return <div>존재하지 않는 캐릭터입니다.</div>;
  }

  return (
    <div className="character-detail">
      <h1>{character.name}</h1>
      <img src={character.image} alt={character.name} className="character-image" />
      <p>{character.description}</p>

      {/* ✅ "대화하기" 버튼 */}
      <CharacterChat character={character.name} />
    </div>
  );
}