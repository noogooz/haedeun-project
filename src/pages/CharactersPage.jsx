import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom"; // useNavigate를 지우고 Link를 사용합니다.
import HatnimeeWeather from "../components/HatnimeeWeather";
import gsap from "gsap";
import "../styles/CharacterProfiles.css";

const characters = [
  { name: "햇님", image: "/images/hatnimee2.png", description: "밝고 활발한 태양의 요정", region: "솔라리움" },
  { name: "달님", image: "/images/dalnim.png", description: "신비롭고 차분한 달의 요정", region: "루나리스 성" },
  { name: "트링", image: "/images/tringi.png", description: "숲과 차를 사랑하는 요정", region: "실바누스 숲" },
  { name: "별님", image: "/images/byulnim.png", description: "시크한 걸크러쉬 별의 요정", region: "별빛 봉우리" },
  { name: "구르미", image: "/images/gurumi.png", description: "구름을 타고 다니는 자유로운 요정", region: "스카이헤이븐" },
  { name: "썬더", image: "/images/thunder.png", description: "번개의 빠른 속도를 가진 요정", region: "템페스트 평원" },
  { name: "토피트", image: "/images/topite.png", description: "귀여운 사랑의 요정", region: "아모리스 동산" },
  { name: "루트", image: "/images/root.png", description: "자연과 교감하는 대지의 요정", region: "실바누스 숲" },
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

  const sortedCharacters = useMemo(() => {
    return [...characters].sort((a, b) => {
      if (sortOption === "A-Z") return a.name.localeCompare(b.name);
      if (sortOption === "Z-A") return b.name.localeCompare(a.name);
      if (sortOption === "random") return Math.random() - 0.5;
      return 0;
    });
  }, [sortOption]);

  const filteredCharacters = useMemo(() => {
    return sortedCharacters.filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedCharacters, searchTerm]);

  return (
    <div className="characters-container">
      {/* --- 기존 헤더, 검색, 정렬, SNS 버튼 부분 (수정 없음) --- */}
      <h1 className="characters-title">🌟 캐릭터 소개</h1>
      <div className="hatnimee-weather-box">
        <HatnimeeWeather />
      </div>
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
      <div className="sns-section">
        <Link to="/sns" className="sns-button">
          SNS
        </Link>
      </div>

      <div ref={cardsRef} className="character-grid">
        {filteredCharacters.map((char) => (
          // ✨ [수정] character-card-wrapper를 Link로 감싸서 페이지 이동 기능 추가
          <Link to={`/characters/${char.name}`} key={char.name} className="character-card-link">
            <div className="character-card-wrapper">
              <div className="character-card">
                <img src={char.image} alt={char.name} className="character-image" />
                <div className="character-info">
                  <h3>{char.name}</h3>
                  <p className="character-region">
                    출신: {char.region || '알려지지 않음'}
                  </p>
                  <p>{char.description}</p>
                </div>
              </div>
              <div className="chat-button-container">
                {/* ✨ [수정] 대화하기 버튼의 Link가 상위 Link와 중첩되지 않도록 onClick으로 변경 */}
                <div className="chat-button" onClick={(e) => {
                    e.preventDefault(); // 상위 Link의 이동을 막음
                    window.location.href = `/chat/${char.name}`; // chat 페이지로 직접 이동
                }}>
                  💬 {char.name}와 대화하기
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}