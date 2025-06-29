import React from "react";
import "../style.css"; // ✅ 스타일 파일 연결

export default function WorldPage() {
  return (
    <div className="world-container">
      {/* 1. 세계관 인트로 섹션 */}
      <div className="world-section">
        <h1 className="world-title">별의 정원, 에테리아 (Aetheria)</h1>
        <p className="world-intro">
          태초의 빛 한 조각과 가장 깊은 밤의 숨결이 만나 탄생한 세계, 에테리아.
          이곳은 현실과 꿈의 경계에서, 반짝이는 별들의 노랫소리와 함께 숨 쉬는 살아있는 정원입니다.
          <br /><br />
          에테리아의 하늘에는 두 개의 심장, 태양 '솔'과 달 '루나'가 함께 떠 있으며, 모든 생명은 이 둘이 쏟아내는 마력의 영향을 받습니다.
          이 세계 어딘가에는, 특별한 아이들이 자신의 힘을 올바르게 사용하는 법을 배우는 비밀스러운 장소, '아르카디아'가 존재한다고 합니다.
        </p>
      </div>

      {/* 2. 주요 지역 소개 섹션 */}
      <div className="world-section">
        <h2 className="world-subtitle">에테리아 탐험하기</h2>

        <div className="region-card">
          <h3>솔라리움 (Solarium) - 햇살 가득한 우리 동네</h3>
          <p>
            높은 빌딩 숲 사이로 아기자기한 카페와 공원이 자리한, 언제나 활기가 넘치는 도시.
            햇님이는 이곳에서 평범한 18살 소녀처럼 살아가지만, 그녀가 손을 뻗으면 시든 화분이 다시 생기를 되찾는 건 그녀만의 작은 비밀입니다.
          </p>
          <p className="character-quote">"오늘 날씨 완전 좋지 않아? 이런 날엔 광합성해야 해! ☀️" - 햇님이</p>
        </div>

        <div className="region-card">
          <h3>루나리스 성 (Lunaris Keep) - 고요한 밤의 도서관</h3>
          <p>세상의 모든 지식과 비밀이 잠들어 있는 밤의 성. 달님이는 이곳에서 밤의 장막 뒤에 숨겨진 진리를 탐구합니다.</p>
          <p className="character-quote">"모든 것은 변하지만, 기록된 진리는 밤하늘의 별처럼 영원히 그 자리를 지키지." - 달님이</p>
        </div>

        {/* 여기에 나머지 지역 카드들을 추가합니다 (실바누스 숲, 별빛 봉우리 등) */}

      </div>
    </div>
  );
}