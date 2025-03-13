export const fetchWeatherData = async () => {
    const API_KEY = "fdaf351a0b6127202a0e429757efd1ae"; // 🔥 OpenWeatherMap API 키 입력
    const CITY = "Seoul"; // 🔥 서울 기준
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=kr`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.weather && data.weather.length > 0) {
        return {
          temperature: data.main.temp, // ✅ 현재 온도
          weather: data.weather[0].main, // ✅ 날씨 상태 (Clear, Rain, Snow 등)
          description: data.weather[0].description, // ✅ 한글 날씨 설명
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("🚨 날씨 데이터를 가져오는 중 오류 발생:", error);
      return null;
    }
  };
  