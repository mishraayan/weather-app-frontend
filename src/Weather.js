import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Weather condition-based background images
const weatherBackgrounds = {

  "clear sky": "/images/clears-sky.jpg",
  "scattered clouds": "/images/cloudy-sky.jpg",
  "overcast clouds": "/images/overcast-sky.jpg",
  "rain": "/images/rainy-sky.jpg",
  "light rain": "/images/rainy-sky.jpg",
  "snow": "/images/snowy-sky.jpg",
};

// Weather icons for display
const weatherImages = {
  "clear sky": "/images/clear-sky.png",
  "scattered clouds": "/images/cloud.png",
  "overcast clouds": "/images/overcast.png",
  "rain": "/images/rain.png",
  "light rain": "/images/rain,png",
  "snow": "/images/snow.png",
};

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      alert("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`https://weather-app-backend-k8jw.onrender.com/weather/${city}`);
      setWeather(res.data);
      fetchHistory();
    } catch (error) {
      alert("Error fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    const res = await axios.get("https://weather-app-backend-k8jw.onrender.com/history");
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const addToFavorites = () => {
    if (weather && !favorites.includes(weather.city)) {
      const updatedFavorites = [...favorites, weather.city];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  return (
    <Container
      style={{
        textAlign: "center",
        marginTop: 0,
        backgroundImage: weather
          ? `url(${weatherBackgrounds[weather?.description?.toLowerCase().trim()] || "/images/default-bg.jpg"})`
          : `url("/images/default-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        paddingBottom: 20,
      }}
    >
      <Typography variant="h3" style={{ fontWeight: "bold", color: "#fff" }}>
        Weather App
      </Typography>

      {/* Search Bar with Location Icon & Floating Label */}
      <TextField
        placeholder="Enter City" // Fixed floating label issue
        variant="outlined"
        fullWidth
        value={city}
        onChange={(e) => {
          let inputValue = e.target.value;
          setCity(inputValue.charAt(0).toUpperCase() + inputValue.slice(1));
        }}
        sx={{
          marginTop: 2,
          maxWidth: 500,
          margin: "20px auto",
          display: "block",
          borderRadius: 2,
          bgcolor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(5px)",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
            "&:hover fieldset": { borderColor: "#fff" },
            "&.Mui-focused fieldset": { borderColor: "#fff" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon sx={{ color: "#fff" }} />
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={fetchWeather}
        style={{
          marginTop: 15,
          padding: "12px 24px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Get Weather"}
      </Button>

      {weather && (
        <Card
          style={{
            marginTop: 20,
            padding: 20,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: 500,
            margin: "20px auto",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              style={{ fontWeight: "bold", color: "#007bff", textTransform: "capitalize" }}
            >
              {weather.city}
              <IconButton onClick={addToFavorites} color="secondary">
                <FavoriteIcon />
              </IconButton>
            </Typography>
            <img
              src={weatherImages[weather.description] || "/images/default.png"}
              alt="Weather Icon"
              style={{ width: 80, height: 80, display: "block", margin: "auto" }}
            />
            <Typography
              variant="h4"
              style={{
                fontWeight: "bold",
                marginTop: 5,
                color: weather.temperature < 0 ? "blue" : "red",
              }}
            >
              {weather.temperature.toFixed(1)}°C
            </Typography>
            <Typography variant="h6" style={{ color: "#555", textTransform: "capitalize" }}>
              {weather.description}
            </Typography>
          </CardContent>
        </Card>
      )}
            {/* Favorite Cities Section */}
            {favorites.length > 0 && (
        <>
          <Typography
            variant="h4"
            style={{
              marginTop: 30,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Favorite Cities
          </Typography>
          {favorites.map((favCity, index) => (
            <Card
              key={index}
              sx={{
                marginTop: 2,
                padding: 2,
                background: "#ffeb3b",
                maxWidth: "500px",
                margin: "auto",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: "purple",
                    fontWeight: "bold",
                  }}
                >
                  {favCity}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    const updatedFavorites = favorites.filter((city) => city !== favCity);
                    setFavorites(updatedFavorites);
                    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                  }}
                  style={{ marginTop: 5 }}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* Weather History Section */}
      <Typography variant="h4" style={{ marginTop: 30, fontWeight: "bold", color: "#fff" }}>
        Weather History
      </Typography>
      {history.map((item, index) => (
        <Card 
          key={index} 
          sx={{ 
            marginTop: 2, 
            padding: 2, 
            background: index % 2 === 0 ? "#f8f8f8" : "#e0e0e0",
            maxWidth: "500px", // Fixed block width
            margin: "auto" // Centered the history blocks
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "purple", fontWeight: "bold" }}>
              {item.city}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: item.temperature < 0 ? "blue" : "red" }}>
              {item.temperature.toFixed(1)}°C
            </Typography>
            <Typography variant="body1">{item.description}</Typography>
            <Typography variant="body2" sx={{ color: "#666", marginTop: 1 }}>
              {new Date(item.timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Weather;
