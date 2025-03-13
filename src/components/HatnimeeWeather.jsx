import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "../utils/fetchWeatherData"; // ✅ 날씨 데이터 가져오는 함수
import "../styles/HatnimeeWeather.css";
import hatnimeeImage from "../images/hatnimee.png"; // ✅ 햇님이 이미지 추가

const HatnimeeWeather = () => {
  const [weather, setWeather] = useState(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getWeather = async () => {
      const weatherData = await fetchWeatherData();
      setWeather(weatherData);
      generateGreeting(weatherData);
    };
    getWeather();
  }, []);

  // ✅ 현재 시간에 따라 햇님이가 다르게 인사하는 함수
  const getTimeBasedGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 6 && hour < 12) return "좋은 아침이야! ☀️";
    if (hour >= 12 && hour < 18) return "좋은 오후야! 😃";
    if (hour >= 18 && hour < 22) return "좋은 저녁이야! 🌇";
    return "밤이 깊었어! 🌙";
  };

  // ✅ 날씨와 시간에 따라 햇님이의 멘트 설정
  const generateGreeting = (weather) => {
    let message = getTimeBasedGreeting();

    if (!weather) {
      setGreeting(message + " 지금 날씨 정보를 가져올 수 없어! 😢");
      return;
    }

    const { weather: weatherType, temperature, description } = weather;

    message += ` 지금 날씨는 ${description}이고, 온도는 ${temperature}°C야.`;

    // ✅ 날씨에 따른 추가 멘트
    if (weatherType.includes("Rain")) {
      message += " 비가 오니까 우산을 꼭 챙겨야 해! ☔";
    } else if (weatherType.includes("Snow")) {
      message += " 눈이 오고 있어! 길이 미끄러울 수 있으니 조심해! ❄️";
    } else if (weatherType.includes("Clouds")) {
      message += " 구름이 많네! 흐린 날이야. ☁️";
    } else if (weatherType.includes("Clear")) {
      message += " 맑은 하늘이야! 기분이 좋아질 것 같아! 🌞";
    }

    // ✅ 기온에 따른 추가 멘트
    if (temperature < 5) {
      message += " 꽤 추우니까 따뜻하게 입는 게 좋아! 🧣";
    } else if (temperature > 30) {
      message += " 오늘은 너무 덥다! 시원한 음료 마시는 거 어때? 🥤";
    } else if (temperature > 25) {
      message += " 살짝 더운 날이야! 햇빛이 강할 수도 있어. 🌤️";
    }

    setGreeting(message);
  };

  if (!weather) return <p>Loading...</p>;

  return (
    <div className="hatnimee-weather-container">
      <img src={hatnimeeImage} alt="Hatnimee" className="hatnimee-image" />
      <div className="weather-bubble">
        <p className="weather-text">{greeting}</p>
      </div>
    </div>
  );
};

export default HatnimeeWeather;