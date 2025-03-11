import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import CharacterCard from "/src/components/CharacterCard"; // ✅ 절대 경로 사용
import characterData from "/src/data/characters.json"; // ✅ 절대 경로 사용
import gsap from "gsap";

export default function CharactersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

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
  }, [characterData]);

  const sortedCharacters = useMemo(() => {
    return [...characterData].sort((a, b) => {
      if (sortOption === "A-Z") return a.name.localeCompare(b.name);
      if (sortOption === "Z-A") return b.name.localeCompare(a.name);
      if (sortOption === "random") return Math.random() - 0.5;
      return 0;
    });
  }, [sortOption, characterData]);

  const filteredCharacters = useMemo(() => {
    return sortedCharacters.filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedCharacters, searchTerm]);

  const toggleFavorite = useCallback((characterName) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.includes(characterName)) {
        updatedFavorites = prevFavorites.filter((name) => name !== characterName);
      } else {
        updatedFavorites = [...prevFavorites, characterName];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  return (
    <div className="characters-container">
      <h1 className="characters-title">🌟 캐릭터 소개</h1>

      {/* 🔍 검색 & 정렬 컨테이너 */}
      <div className="search-sort-wrapper"> {/* ✅ 추가된 감싸는 컨테이너 */}
      <div className="search-sort-container" style={{ maxWidth: "360px", margin: "0 auto" }}>

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
      </div>

      <div ref={cardsRef} className="characters-grid">
        {filteredCharacters.map((char) => (
          <CharacterCard
            key={char.name}
            name={char.name}
            description={char.description}
            isFavorite={favorites.includes(char.name)}
            toggleFavorite={() => toggleFavorite(char.name)}
          />
        ))}
      </div>
    </div>
  );
}
