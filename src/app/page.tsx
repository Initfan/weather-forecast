"use client";
import {
	useState,
	useEffect,
	useCallback,
	ChangeEvent,
	FormEvent,
} from "react";
import { CurrentWeatherData, ForecastData } from "@/utils/type";
import Search from "../components/search";
import CurrentWeather from "../components/CurrentWeather";
import Forecast from "../components/Forecast";
import { SearchBox } from "@/components/SearchBox";

export default function WeatherApp() {
	const [location, setLocation] = useState("Jakarta");
	const [weather, setWeather] = useState<CurrentWeatherData>();
	const [forecast, setForecast] = useState<ForecastData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [units, setUnits] = useState<"metric" | "imperial">("metric"); // metric atau imperial
	const [currentTime, setCurrentTime] = useState<String>();

	const fetchWeather = useCallback(
		async (cord?: string) => {
			setLoading(true);
			setError(null);

			try {
				const req = await fetch("api/weather", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ location: cord || location }),
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
		},
		[location]
	);

	const selectedLocation = (cord: string) => {
		fetchWeather(cord);
	};

	const currentPosition = (position: GeolocationPosition) => {
		console.log(position);
	};

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(currentPosition);
		setCurrentTime(new Date().toLocaleString("id-ID"));
		fetchWeather();
	}, []);

	const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
		setLocation(e.target!.value);
	};

	const toggleUnits = () => {
		setUnits(units === "metric" ? "imperial" : "metric");
	};

	return (
		<main className="h-screen overflow-y-scroll bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 ">
			<div className="flex flex-col items-center min-h-screen p-4 ">
				<div className="w-full max-w-lg mx-auto space-y-6">
					<h1 className="text-3xl font-bold text-center my-4 text-white">
						Aplikasi Perkiraan Cuaca
					</h1>

					<div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
						<SearchBox selectedLocation={selectedLocation} />

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

					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}

					{weather && (
						<CurrentWeather
							units={units}
							weather={weather}
							loading={loading}
						/>
					)}

					{forecast.length > 0 && (
						<Forecast
							forecast={forecast}
							units={units}
							loading={loading}
						/>
					)}

					<div className="text-center text-gray-600 mt-6 text-sm">
						Data diperbarui terakhir: {currentTime}
					</div>
				</div>
			</div>
		</main>
	);
}
