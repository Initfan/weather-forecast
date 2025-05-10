"use client";
import { useState, useEffect } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
} from "lucide-react";
import { ForecastData, WeatherData } from "@/utils/type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Komponen utama aplikasi cuaca
export default function WeatherApp() {
  const [location, setLocation] = useState("Jakarta");
  const [weather, setWeather] = useState<WeatherData>();
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
        `http://api.weatherapi.com/v1/current.json?key=ac6f651b9a494baf85c50206251005&q=${location}&aqi=no`
      );
      const res = await req.json();
      console.log(res);

      setWeather({
        city: location,
        temp: units === "metric" ? res.current.temp_c : res.current.temp_f,
        humidity: res.current.humidity,
        windSpeed:
          units === "metric" ? res.current.wind_kph : res.current.wind_mph,
        condition: res.current.condition.text,
        feels_like:
          units === "metric"
            ? res.current.feelslike_c
            : res.current.feelslike_f,
      });

      // Data perkiraan 5 hari
      setForecast([
        {
          day: "Senin",
          temp: units === "metric" ? 29 : 84,
          condition: "cerah",
        },
        {
          day: "Selasa",
          temp: units === "metric" ? 28 : 82,
          condition: "berawan",
        },
        {
          day: "Rabu",
          temp: units === "metric" ? 27 : 81,
          condition: "hujan ringan",
        },
        {
          day: "Kamis",
          temp: units === "metric" ? 26 : 79,
          condition: "hujan",
        },
        {
          day: "Jumat",
          temp: units === "metric" ? 28 : 82,
          condition: "cerah berawan",
        },
      ]);

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

  // Mendapatkan ikon yang sesuai berdasarkan kondisi cuaca
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "cerah":
        return <Sun size={32} className="text-yellow-500" />;
      case "berawan":
        return <Cloud size={32} className="text-gray-500" />;
      case "hujan ringan":
        return <CloudDrizzle size={32} className="text-blue-400" />;
      case "hujan":
        return <CloudRain size={32} className="text-blue-500" />;
      case "badai":
        return <CloudLightning size={32} className="text-purple-500" />;
      case "salju":
        return <CloudSnow size={32} className="text-blue-200" />;
      default:
        return <Cloud size={32} className="text-gray-400" />;
    }
  };

  // Handler untuk ubah lokasi
  const handleLocationChange = (e: any) => {
    setLocation(e.target!.value);
  };

  // Handler untuk submit pencarian
  const handleSubmit = () => {
    fetchWeather();
  };

  // Handler untuk ubah unit suhu
  const toggleUnits = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center my-4">Aplikasi Cuaca</h1>

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
                {getWeatherIcon(weather.condition)}
                <span className="ml-2 text-gray-600">{weather.condition}</span>
              </div>
            </div>

            <div className="text-5xl font-bold text-center mb-4">
              {weather.temp}°{units === "metric" ? "C" : "F"}
            </div>

            <div className="text-center text-gray-500 mb-4">
              Terasa seperti: {weather.feels_like}°
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
                  <div className="font-medium">{day.day}</div>
                  <div className="my-2">{getWeatherIcon(day.condition)}</div>
                  <div className="text-sm">
                    {day.temp}°{units === "metric" ? "C" : "F"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-gray-600 mt-6 text-sm">
          Data diperbarui terakhir: {new Date().toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  );
}
