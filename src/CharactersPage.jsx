import React, { useEffect, useRef, useState } from 'react';
import CharacterCard from './components/CharacterCard';
import characters from './data/characters.json';
import gsap from 'gsap';

export default function CharactersPage() {
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 검색 상태
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [sortOption, setSortOption] = useState("default"); // 정렬 상태
  const cardsRef = useRef(null);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  const toggleFavorite = (characterName) => {
    let updatedFavorites;
    if (favorites.includes(characterName)) {
      updatedFavorites = favorites.filter((name) => name !== characterName);
    } else {
      updatedFavorites = [...favorites, characterName];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // 🔄 캐릭터 정렬 함수
  const sortedCharacters = [...characters].sort((a, b) => {
    if (sortOption === "A-Z") return a.name.localeCompare(b.name);
    if (sortOption === "Z-A") return b.name.localeCompare(a.name);
    if (sortOption === "random") return Math.random() - 0.5;
    return 0;
  });

  // 🔍 검색 기능 추가 (정렬 후 필터링)
  const filteredCharacters = sortedCharacters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* 🔍 검색창 */}
      <input
        type="text"
        placeholder="캐릭터 이름 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* 🔄 정렬 드롭다운 메뉴 */}
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

      <div ref={cardsRef} className="character-container">
        {filteredCharacters.map((character, index) => (
          <CharacterCard
            key={index}
            name={character.name}
            description={character.description}
            isFavorite={favorites.includes(character.name)}
            toggleFavorite={() => toggleFavorite(character.name)}
          />
        ))}
      </div>
    </div>
  );
}
