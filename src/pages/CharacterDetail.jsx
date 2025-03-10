import React from "react";
import { useParams } from "react-router-dom";
import characters from "../data/characters.json"; // 캐릭터 데이터 불러오기

export default function CharacterDetail() {
  const { name } = useParams(); // URL에서 캐릭터 이름 가져오기
  const character = characters.find((char) => char.name === name);

  if (!character) {
    return <h2>캐릭터 정보를 찾을 수 없습니다.</h2>;
  }

  return (
    <div className="character-detail">
      <h1>{character.name}</h1>
      <p>{character.description}</p>
    </div>
  );
}
