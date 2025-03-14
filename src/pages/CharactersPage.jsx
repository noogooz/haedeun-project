import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import HatnimeeWeather from "../components/HatnimeeWeather";
import gsap from "gsap";
import "../styles/CharacterProfiles.css";

// 캐릭터 데이터
const characters = [
  { name: "햇님", image: "/images/hatnimee2.png", description: "밝고 활발한 태양의 요정" },
  { name: "달님", image: "/images/dalnim.png", description: "신비롭고 차분한 달의 요정 " },
  { name: "트링", image: "/images/tringi.png", description: "숲과 차를 사랑하는 요정 " },
  { name: "별님", image: "/images/byulnim.png", description: "시크한 걸크러쉬 별의 요정 " },
  { name: "구르미", image: "/images/gurumi.png", description: "구름을 타고 다니는 자유로운 요정" },
  { name: "썬더", image: "/images/thunder.png", description: "번개의 빠른 속도를 가진 열정 요정" },
  { name: "토피트", image: "/images/topite.png", description: "귀여운 사랑의 요정" },
  { name: "루트", image: "/images/root.png", description: "자연과 교감하는 대지의 요정" },
];

export default function CharactersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const cardsRef = useRef(null);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // 정렬 기능
  const sortedCharacters = useMemo(() => {
    return [...characters].sort((a, b) => {
      if (sortOption === "A-Z") return a.name.localeCompare(b.name);
      if (sortOption === "Z-A") return b.name.localeCompare(a.name);
      if (sortOption === "random") return Math.random() - 0.5;
      return 0;
    });
  }, [sortOption]);

  // 검색 필터 기능
  const filteredCharacters = useMemo(() => {
    return sortedCharacters.filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedCharacters, searchTerm]);

  return (
    <div className="characters-container">
      <h1 className="characters-title">🌟 캐릭터 소개</h1>

      {/* ✅ 햇님이 날씨 반영 기능 추가 */}
      <div className="hatnimee-weather-box">
        <HatnimeeWeather />
      </div>

      {/* 🔍 검색 & 정렬 컨테이너 */}
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="캐릭터 이름 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          className="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">정렬 선택</option>
          <option value="A-Z">이름순 (A-Z)</option>
          <option value="Z-A">이름순 (Z-A)</option>
          <option value="random">랜덤 정렬</option>
        </select>
      </div>

      {/* ✅ AI 챗봇 버튼 추가 */}
      <Link to="/chatbot" className="chatbot-button">
        🌞 햇님이와 대화하기
      </Link>

      {/* ✅ SNS 이동 버튼 추가 */}
      <Link to="/sns" className="sns-button">
        SNS
      </Link>

      {/* ✅ 캐릭터 카드 리스트 */}
      <div ref={cardsRef} className="character-grid">
        {filteredCharacters.map((char) => (
          <Link to={`/character/${char.name}`} key={char.name} className="character-card">
            <img src={char.image} alt={char.name} className="character-image" />
            <div className="character-info">
              <h3>{char.name}</h3>
              <p>{char.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
<div className="characters-container">
  <div className="stars">
    {Array.from({ length: 50 }).map((_, index) => (
      <div key={index} className="star" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}></div>
    ))}
  </div>

  <div className="moving-clouds"></div>

  <h1 className="characters-title">🌟 캐릭터 소개</h1>
  
  {/* 기존 코드 유지 */}
</div>