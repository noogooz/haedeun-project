import React from "react";
import { useParams } from "react-router-dom";
import characters from "../data/characters.json"; // 캐릭터 데이터 불러오기
import "../styles/CharacterDetail.css"; // ✅ 스타일 적용

export default function CharacterDetail() {
  const { name } = useParams(); // URL에서 캐릭터 이름 가져오기
  const character = characters.find((char) => char.name === name);

  if (!character) {
    return <h2>캐릭터 정보를 찾을 수 없습니다.</h2>;
  }

  return (
    <div className={`character-detail ${name === "햇님이" ? "haetnime-style" : ""}`}>
      <h1>{character.name}</h1>
      <p>{character.description || "아직 설정되지 않았어요."}</p>
    </div>
  );
}
