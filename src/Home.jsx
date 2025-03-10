import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const playSound = () => {
    const audio = new Audio('/7091f8__pixabay__soft-wind-chime.wav');
    audio.volume = 0.2;
    audio.play();
  };

  return (
    <div className="home">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        디자이너 김해든
      </motion.h1>

      <Link to="/characters">
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          onClick={playSound}  
        >
          캐릭터 보러가기
        </motion.button>
      </Link>
    </div>
  );
}
