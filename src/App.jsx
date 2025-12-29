import { useState } from "react";

const fadeUp = `
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const weatherEffects = `
.weather-card {
  position: relative;
  overflow: hidden;
}

.weather-content {
  position: relative;
  z-index: 2;
}

/* BASE */
.weather-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: background 0.6s ease, opacity 0.6s ease;
}

/* 🌞 DAY / 🌙 NIGHT TINT */
.weather-bg.day {
  background-color: rgba(255, 255, 255, 0.46);
}

.weather-bg.night {
  background-color: rgba(2, 6, 23, 0.35);
}

/* 🔥 TEMP INTENSITY */
.weather-bg.hot {
  filter: brightness(1.15) saturate(1.2);
}

.weather-bg.cold {
  filter: brightness(0.95) saturate(0.9);
}

/* ☀️ CLEAR / SUNNY */
.weather-bg.clear {
  background:
    radial-gradient(
      circle at center,
      rgba(253,224,71,0.65),
      rgba(253,224,71,0.25),
      transparent 100%
    );
  animation: pulseSun 4.5s ease-in-out infinite;
}

/* ☁️ CLOUDS */
.weather-bg.clouds {
  background:
    radial-gradient(circle at 20% 30%, rgba(226,232,240,0.45), transparent 60%),
    radial-gradient(circle at 60% 40%, rgba(203,213,225,0.35), transparent 55%),
    radial-gradient(circle at 90% 30%, rgba(226,232,240,0.3), transparent 60%);
  animation: cloudsMove 40s linear infinite;
}

/* 🌧️ RAIN — SLANTED STREAKS */
.weather-bg.rain {
  background:
    repeating-linear-gradient(
      -75deg,
      rgba(148,163,184,0.45),
      rgba(148,163,184,0.45) 2px,
      transparent 2px,
      transparent 10px
    );
  animation: rainFall 1s linear infinite;
}

/* 🌫️ SMOKE / HAZE */
.weather-bg.smoke {
  background:
    linear-gradient(
      180deg,
      rgba(30,41,59,0.45),
      rgba(148,163,184,0.35),
      rgba(226,232,240,0.25)
    ),
    radial-gradient(circle at 30% 40%, rgba(226,232,240,0.35), transparent 60%),
    radial-gradient(circle at 70% 55%, rgba(148,163,184,0.3), transparent 65%);
  animation: smokeDrift 26s ease-in-out infinite;
}

/* ❄️ SNOW — BIGGER FLAKES */
.weather-bg.snow {
  background-image:
    radial-gradient(circle, rgba(226,232,240,0.9) 2px, transparent 2px);
  background-size: 16px 16px;
  animation: snowFall 7s linear infinite;
}

/* ⚡ THUNDER */
.weather-bg.thunderstorm {
  background: rgba(2,6,23,0.7);
  animation: lightning 5.5s infinite;
}

/* 🌬️ ANIMATIONS */
@keyframes pulseSun {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.35; }
}

@keyframes cloudsMove {
  from { background-position: -300px 0; }
  to { background-position: 300px 0; }
}

@keyframes rainFall {
  from { background-position: 0 -100px; }
  to { background-position: 0 100px; }
}

@keyframes smokeDrift {
  0% { background-position: 0 0; opacity: 0.2; }
  50% { background-position: 200px -50px; opacity: 0.35; }
  100% { background-position: 0 0; opacity: 0.2; }
}

@keyframes snowFall {
  from { background-position: 0 -100px; }
  to { background-position: 40px 100px; }
}

@keyframes lightning {
  0%, 90%, 100% { background-color: rgba(2,6,23,0.7); }
  92% { background-color: rgba(253,224,71,0.35); }
  94% { background-color: rgba(253,224,71,0.15); }
}
`;

const inputFocus = `
input:focus {
  border-color: #22c55e;
  outline: none;
}
`;

const buttonHover = `
button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(34,197,94,0.35);
  background: #16a34a;
}
`;

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchWeather() {
    if (!city || loading) return;

    setError("");
    setWeather(null);
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Something went wrong");
      }

      const data = await res.json();

      setWeather({
  name: data.name,
  temp: Math.round(data.main.temp),
  condition: data.weather[0].description,
  type: data.weather[0].main.toLowerCase(),
  isDay: data.dt > data.sys.sunrise && data.dt < data.sys.sunset, // 🌞🌙
    });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function WeatherBackdrop({ type, isDay, temp }) {
  return (
    <div
      className={`weather-bg ${type} ${isDay ? "day" : "night"} ${
        temp >= 30 ? "hot" : temp <= 10 ? "cold" : ""
      }`}
    />
  );
}

  return (
  <div style={styles.page}>
    <style>{fadeUp}</style>
    <style>{inputFocus}</style>
    <style>{buttonHover}</style>
    <style>{weatherEffects}</style>

    {/*FULL-PAGE WEATHER BACKDROP */}
    {weather && (
      <WeatherBackdrop
        type={weather.type}
        isDay={weather.isDay}
        temp={weather.temp}
      />
    )}

    <div style={styles.app}>
      <h1>Weather App 🌦️</h1>

      <input
        style={styles.input}
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") fetchWeather();
        }}
      />

      <button
        style={{
          ...styles.button,
          background: loading ? "#334155" : "#22c55e",
          color: loading ? "#94a3b8" : "#020617",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading
            ? "none"
            : "0 10px 20px rgba(34,197,94,0.25)",
        }}
        onClick={fetchWeather}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Weather"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {weather && (
        <div style={styles.card}>
          <h2>{weather.name}</h2>
          <p style={styles.temp}>{weather.temp}°C</p>
          <p style={styles.condition}>{weather.condition}</p>
        </div>
      )}
    </div>
  </div>
);
}

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#020617",
  },


  app: {
    width: "100%",
    maxWidth: "420px",
    background: "#0f172a",
    padding: "2.25rem",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    color: "#e5e7eb",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
    border: "1px solid #1e293b",
    zIndex: 1,
  },

  input: {
    padding: "0.75rem",
    borderRadius: "10px",
    border: "2px solid transparent",
    fontSize: "1rem",
    background: "#020617",
    color: "#e5e7eb",
  },

  button: {
    padding: "0.75rem",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  card: {
    background: "#1e293b",
    padding: "1.25rem",
    borderRadius: "14px",
    marginTop: "1.2rem",
    textAlign: "center",
    animation: "fadeUp 0.35s ease",
  },

  temp: {
    fontSize: "2.75rem",
    fontWeight: "700",
    margin: "0.4rem 0",
  },

  condition: {
    textTransform: "capitalize",
    opacity: 0.75,
    fontSize: "0.95rem",
  },

  error: {
    color: "#f87171",
    textAlign: "center",
  },
};