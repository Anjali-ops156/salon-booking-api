// api/weather.js
// API 2 — Bahar ki keyed API (OpenWeatherMap)
// API key .env.local se aati hai — code mein kabhi nahi likhni.
//
//   GET /api/weather?city=Ludhiana

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      error: "Only GET is allowed on this endpoint"
    });
  }

  const city = req.query.city || "Ludhiana";
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: "WEATHER_API_KEY is not configured on the server"
    });
  }

  const url =
    "https://api.openweathermap.org/data/2.5/weather" +
    `?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          success: false,
          error: `City "${city}" not found`
        });
      }
      if (response.status === 401) {
        return res.status(500).json({
          success: false,
          error: "Weather API key is invalid"
        });
      }
      if (response.status === 429) {
        return res.status(429).json({
          success: false,
          error: "Too many requests — free tier limit reached"
        });
      }
      return res.status(502).json({
        success: false,
        error: "Weather service is unavailable right now"
      });
    }

    const w = await response.json();
    const humidity = w.main.humidity;
    const temp = w.main.temp;

    let suggestion;
    if (humidity > 70) {
      suggestion = "Humid day — suggest Hair Spa or an anti-frizz treatment";
    } else if (temp > 32) {
      suggestion = "Hot day — suggest a cooling Head Massage";
    } else {
      suggestion = "Pleasant weather — good day for Hair Colour or Styling";
    }

    return res.status(200).json({
      success: true,
      city: w.name,
      temperature: Math.round(temp),
      condition: w.weather[0].description,
      humidity,
      wind_speed: w.wind.speed,
      salon_suggestion: suggestion
    });
  } catch (err) {
    return res.status(502).json({
      success: false,
      error: "Could not reach the weather service"
    });
  }
}
