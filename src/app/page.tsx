"use client";
import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";
import { CurrentWeatherData, ForecastData } from "@/utils/type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/cloud-background.jpg";
import { url } from "inspector";

// Komponen utama aplikasi cuaca
export default function WeatherApp() {
  const [location, setLocation] = useState("Jakarta");
  const [weather, setWeather] = useState<CurrentWeatherData>();
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState("metric"); // metric atau imperial

  // Fungsi untuk mendapatkan data cuaca (simulasi)
  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const req = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=ac6f651b9a494baf85c50206251005&q=${location}&days=5`
      );
      const res = await req.json();

      setWeather({
        cloud: res.current.cloud,
        city: res.location.name,
        condition: {
          code: res.current.condition.code,
          icon: res.current.condition.icon,
          text: res.current.condition.text,
        },
        feelslike:
          units === "metric"
            ? res.current.feelslike_c
            : res.current.feelslike_f,
        humidity: res.current.humidity,
        is_day: res.current.is_day,
        temp: units === "metric" ? res.current.temp_c : res.current.temp_f,
        windSpeed:
          units === "metric" ? res.current.wind_kph : res.current.wind_mph,
      });

      // Data perkiraan 5 hari
      setForecast(
        res.forecast.forecastday.map((day: any) => ({
          date: new Date(day.date).toLocaleString("id-ID", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
          day: {
            maxtemp: units === "metric" ? day.day.maxtemp_c : day.day.maxtemp_f,
            mintemp: units === "metric" ? day.day.mintemp_c : day.day.mintemp_f,
            avgtemp: units === "metric" ? day.day.avgtemp_c : day.day.avgtemp_f,
            maxwind:
              units === "metric" ? day.day.maxwind_kph : day.day.maxwind_mph,
            totalprecip: day.day.totalprecip_mm,
            avghumidity: day.day.avghumidity,
          },
          condition: {
            code: day.day.condition.code,
            icon: day.day.condition.icon,
            text: day.day.condition.text,
          },
        }))
      );

      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Gagal memuat data cuaca");
      setLoading(false);
    }
  };

  // Menjalankan fungsi saat komponen dimuat pertama kali
  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    console.log(condition);
    const rain = ["moderate rain", "patchy rain nearby", "patchy rain"];
    const snow = ["light snow", "heavy snow", "snow"];

    if (rain.includes(condition)) {
      return <CloudRain size={32} className="text-blue-500" />;
    } else if (snow.includes(condition)) {
      return <CloudSnow size={32} className="text-blue-200" />;
    } else if (condition === "sunny") {
      return <Sun size={32} className="text-yellow-500" />;
    } else if (condition === "mist") {
      return <Cloud size={32} className="text-gray-500" />;
    }
  };

  const handleLocationChange = (e: any) => {
    setLocation(e.target!.value);
  };

  // Handler untuk submit pencarian
  const handleSubmit = () => {
    fetchWeather();
  };

  console.log(weather?.condition);

  // Handler untuk ubah unit suhu
  const toggleUnits = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };

  return (
    <main className="h-screen overflow-y-scroll bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 ">
      {/* Classname bg-gradient-to-br from-blue-200 to-blue-400 */}
      <div
        className="flex flex-col items-center min-h-screen p-4 "
        // style={{
        //   background: `url("../assets/cloud-background.jpg") no-repeat center center fixed`,
        // }}
      >
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center my-4 text-white">
            Aplikasi Cuaca
          </h1>

          {/* Pencarian */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex mb-6 space-x-2">
              <Input
                type="text"
                placeholder="Masukkan nama kota..."
                value={location}
                onChange={handleLocationChange}
                // className="flex-1 p-2 rounded-l border border-gray-300 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
              <Button
                onClick={handleSubmit}
                // className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
              >
                Cari
              </Button>
            </div>

            {/* Toggle unit suhu */}
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleUnits}
                className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
              >
                {units === "metric" ? "°C" : "°F"} →{" "}
                {units === "metric" ? "°F" : "°C"}
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Cuaca saat ini */}
          {weather && !loading && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{weather.city}</h2>
                <div className="flex items-center">
                  {getWeatherIcon(weather.condition.text.toLowerCase())}
                  <span className="ml-2 text-gray-600">
                    {weather.condition.text}
                  </span>
                </div>
              </div>

              <div className="text-5xl font-bold text-center mb-4">
                {weather.temp}°{units === "metric" ? "C" : "F"}
              </div>

              <div className="text-center text-gray-500 mb-4">
                Terasa seperti: {weather.feelslike}°
                {units === "metric" ? "C" : "F"}
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-blue-700 font-semibold">Kelembaban</div>
                  <div>{weather.humidity}%</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-blue-700 font-semibold">
                    Kecepatan Angin
                  </div>
                  <div>
                    {weather.windSpeed} {units === "metric" ? "km/h" : "mph"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Perkiraan 5 hari */}
          {forecast.length > 0 && !loading && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Perkiraan 5 Hari</h3>
              <div className="grid grid-cols-5 gap-2">
                {forecast.map((day, index) => (
                  <div key={index} className="flex flex-col items-center p-2">
                    <div className="font-medium">{day.date.toString()}</div>
                    <div className="my-2">
                      {getWeatherIcon(day.condition.text.toLowerCase())}
                    </div>
                    <div className="text-sm">
                      {day.day.maxtemp}°{units === "metric" ? "C" : "F"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-gray-600 mt-6 text-sm">
            {/* Data diperbarui terakhir: {new Date().toLocaleString("id-ID")} */}
          </div>
        </div>
      </div>
    </main>
  );
}
