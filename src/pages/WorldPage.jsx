import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import charactersData from "../data/characters.json";
import "../styles/WorldPage.css";

const regionCoords = {
  "솔라리움": { top: '22%', left: '30%' },
  "루나리스 성": { top: '25%', left: '75%' },
  "실바누스 숲": { top: '70%', left: '55%' },
  "별빛 봉우리": { top: '10%', left: '50%'},
  "스카이헤이븐": { top: '50%', left: '80%'},
  "템페스트 평원": { top: '80%', left: '20%'},
  "아모리스 동산": { top: '55%', left: '25%'}
};

export default function WorldPage() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const uniqueRegions = useMemo(() => {
    const regionMap = new Map();
    charactersData.forEach(char => {
      if (char.region && !regionMap.has(char.region)) {
        regionMap.set(char.region, {
          name: char.region,
          description: char.regionDescription,
          quote: char.regionQuote,
          quoteAuthor: char.name,
          characterImage: char.image,
          coords: regionCoords[char.region] || { top: '50%', left: '50%' },
          color: char.regionColor || '#ffda79' // ✨ 지역 색상 추가
        });
      }
    });
    return Array.from(regionMap.values());
  }, []);

  return (
    <div className="world-page-container">
      <div className="world-header">
        <h1 className="world-main-title">별의 정원, 에테리아</h1>
        <p className="world-main-intro">
          지도 위의 반짝이는 지역을 탐험하고 에테리아의 이야기를 만나보세요.
        </p>
      </div>
      
      <div className="world-content-grid">
        <motion.div 
            className="world-map-wrapper"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
        >
          <img src="/images/world-map.png" alt="에테리아 월드맵" className="world-map-image-bg" />
          {uniqueRegions.map((region) => (
            <motion.div
              key={region.name}
              className="world-region-pin"
              style={{
                top: region.coords.top,
                left: region.coords.left,
                '--pin-color': region.color // ✨ CSS 변수로 색상 전달
              }}
              onMouseEnter={() => setSelectedRegion(region)}
              onMouseLeave={() => setSelectedRegion(null)}
              whileHover={{ scale: 1.6, zIndex: 2 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </motion.div>

        <div className="world-info-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRegion ? selectedRegion.name : "default"}
              className="world-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {selectedRegion ? (
                <>
                  <div className="info-card-header">
                    <img src={selectedRegion.characterImage} alt={selectedRegion.quoteAuthor} className="info-card-character-img" />
                    <h2>{selectedRegion.name}</h2>
                  </div>
                  <p className="info-card-desc">{selectedRegion.description}</p>
                  <blockquote className="info-card-quote">
                    "{selectedRegion.quote}"
                    <footer>- {selectedRegion.quoteAuthor}</footer>
                  </blockquote>
                  <Link to={`/characters`} className="info-card-button">
                    관련 캐릭터 보러가기
                  </Link>
                </>
              ) : (
                <div className="info-card-default">
                  <h3>탐험을 시작하세요</h3>
                  <p>지도 위의 반짝이는 핀에 마우스를 올리면, 그 지역의 숨겨진 이야기를 들을 수 있습니다.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}