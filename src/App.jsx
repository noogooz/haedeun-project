import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CharactersPage from './CharactersPage';
import CharacterDetail from './pages/CharacterDetail'; // ✅ 추가

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/:name" element={<CharacterDetail />} /> {/* ✅ 캐릭터 상세 페이지 추가 */}
      </Routes>
    </BrowserRouter>
  );
}
