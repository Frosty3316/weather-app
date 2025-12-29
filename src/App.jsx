import { useState } from "react";

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
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
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
            background: loading ? "#64748b" : "#22c55e",
            cursor: loading ? "not-allowed" : "pointer",
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
    display: "flex",
    alignItems: "center",        
    justifyContent: "center",      
    background: "#020617",
  },

  app: {
    width: "100%",
    maxWidth: "420px",
    background: "#0f172a",
    padding: "2rem",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    color: "#e5e7eb",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },

  input: {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
  },

  button: {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  card: {
    background: "#1e293b",
    padding: "1.2rem",
    borderRadius: "12px",
    marginTop: "1rem",
    textAlign: "center",
  },

  temp: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "0.5rem 0",
  },

  condition: {
    textTransform: "capitalize",
    opacity: 0.8,
  },

  error: {
    color: "#f87171",
    textAlign: "center",
  },
};