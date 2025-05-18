"use client";
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";
import { CurrentWeatherData, ForecastData } from "@/utils/type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// pulling page.tsx

// Komponen utama aplikasi cuaca
export default function WeatherApp() {
	const [location, setLocation] = useState("Jakarta");
	const [weather, setWeather] = useState<CurrentWeatherData>();
	const [forecast, setForecast] = useState<ForecastData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [units, setUnits] = useState("metric"); // metric atau imperial

	// Fungsi untuk mendapatkan data cuaca (simulasi)
	const fetchWeather = useCallback(async () => {
		console.log("fetching weather");
		setLoading(true);
		setError(null);

		try {
			const req = await fetch("api/weather", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ location, units }),
			});
			const res = await req.json();

			const current = res.current as CurrentWeatherData;

			setWeather({
				cloud: res.current.cloud,
				city: res.location.name,
				condition: {
					code: res.current.condition.code,
					icon: res.current.condition.icon,
					text: res.current.condition.text,
				},
				feelslike_c: current.feelslike_c,
				feelslike_f: current.feelslike_f,
				temp_c: current.temp_c,
				temp_f: current.temp_f,
				wind_kph: current.wind_kph,
				wind_mph: current.wind_mph,
				humidity: res.current.humidity,
				is_day: res.current.is_day,
			});

			const forecasts = res.forecast.forecastday as ForecastData[];

			// Data perkiraan 5 hari
			setForecast(
				forecasts.map((day: ForecastData) => ({
					date: day.date,
					day: {
						maxtemp_c: day.day.maxtemp_c,
						maxtemp_f: day.day.maxtemp_f,
						avgtemp: day.day.avgtemp,
						avgtemp_c: day.day.avgtemp_c,
						avgtemp_f: day.day.avgtemp_f,
						condition: {
							code: day.day.condition.code,
							icon: day.day.condition.icon,
							text: day.day.condition.text,
						},
						avghumidity: day.day.avghumidity,
						maxwind: day.day.maxwind,
						maxwind_kph: day.day.maxwind_kph,
						maxwind_mph: day.day.maxwind_mph,
						mintemp_c: day.day.mintemp_c,
						mintemp_f: day.day.mintemp_f,
						totalprecip: day.day.totalprecip,
						totalprecip_in: day.day.totalprecip_in,
						totalprecip_mm: day.day.totalprecip_mm,
					},
				}))
			);

			setLoading(false);
		} catch (error) {
			console.log(error);
			setError("Gagal memuat data cuaca");
			setLoading(false);
		}
	}, [location]);

	// Menjalankan fungsi saat komponen dimuat pertama kali
	useEffect(() => {
		fetchWeather();
	}, []);

	const getWeatherIcon = (condition: string) => {
		const rain = [
			"moderate rain",
			"patchy rain nearby",
			"patchy rain",
			"patchy light drizzle",
		];
		const snow = ["light snow", "heavy snow", "snow"];
		const cloudly = ["partly cloudy"];

		if (rain.includes(condition)) {
			return <CloudRain size={32} className="text-blue-500" />;
		} else if (snow.includes(condition)) {
			return <CloudSnow size={32} className="text-blue-200" />;
		} else if (condition === "sunny") {
			return <Sun size={32} className="text-yellow-500" />;
		} else if (cloudly.includes(condition)) {
			return <Cloud size={32} className="text-gray-500" />;
		}
	};

	const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
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
		<main className="h-screen overflow-y-scroll bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 ">
			<div className="flex flex-col items-center min-h-screen p-4 ">
				<div className="w-full max-w-lg mx-auto">
					<h1 className="text-3xl font-bold text-center my-4 text-white">
						Aplikasi Perkiraan Cuaca
					</h1>

					{/* Pencarian */}
					<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
						<div className="flex mb-6 space-x-2">
							<Input
								type="text"
								placeholder="Masukkan nama kota..."
								value={location}
								onChange={handleLocationChange}
								className="flex-1 p-2 rounded-l border border-gray-300 focus:outline-none"
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										handleSubmit();
									}
								}}
							/>
							<Button onClick={handleSubmit}>Cari</Button>
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
								<h2 className="text-2xl font-semibold">
									{weather.city}
								</h2>
								<div className="flex items-center">
									{getWeatherIcon(
										weather.condition.text.toLowerCase()
									)}
									<span className="ml-2 text-gray-600">
										{weather.condition.text}
									</span>
								</div>
							</div>

							<div className="text-5xl font-bold text-center mb-4">
								{units === "metric"
									? weather.temp_c
									: weather.temp_f}
								°{units === "metric" ? "C" : "F"}
							</div>

							<div className="text-center text-gray-500 mb-4">
								Terasa seperti:{" "}
								{units === "metric"
									? weather.feelslike_c
									: weather.feelslike_f}
								°{units === "metric" ? "C" : "F"}
							</div>

							<div className="grid grid-cols-2 gap-4 text-center">
								<div className="bg-blue-50 p-2 rounded">
									<div className="text-blue-700 font-semibold">
										Kelembaban
									</div>
									<div>{weather.humidity}%</div>
								</div>
								<div className="bg-blue-50 p-2 rounded">
									<div className="text-blue-700 font-semibold">
										Kecepatan Angin
									</div>
									<div>
										{units === "metric"
											? weather.wind_kph
											: weather.wind_mph}{" "}
										{units === "metric" ? "km/h" : "mph"}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Perkiraan 5 hari */}
					{forecast.length > 0 && !loading && (
						<div className="bg-white rounded-lg shadow-lg p-6">
							<h3 className="text-xl font-semibold mb-4">
								Perkiraan 5 Hari
							</h3>
							<div className="grid grid-cols-5 gap-2">
								{forecast.map((day, index) => (
									<div
										key={index}
										className="flex flex-col items-center p-2"
									>
										<div className="font-medium">
											{new Date(
												day.date
											).toLocaleDateString("id-ID", {
												day: "2-digit",
												weekday: "short",
											})}
										</div>
										<div className="my-2">
											{getWeatherIcon(
												day.day.condition.text.toLowerCase()
											)}
										</div>
										<div className="text-sm">
											{units === "metric"
												? day.day.avgtemp_c
												: day.day.avgtemp_f}
											°{units === "metric" ? "C" : "F"}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="text-center text-gray-600 mt-6 text-sm">
						Data diperbarui terakhir:{" "}
						{/* {new Date().toLocaleString("id-ID")} */}
					</div>
				</div>
			</div>
		</main>
	);
}
