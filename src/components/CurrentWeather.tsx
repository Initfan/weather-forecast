import { CurrentWeatherData } from "@/utils/type";
import React from "react";
import WeatherIcon from "./WeatherIcon";
import { Skeleton } from "@/components/ui/skeleton";

const CurrentWeather = ({
	weather,
	units,
}: // loading,
{
	weather?: CurrentWeatherData;
	units: "metric" | "imperial";
	// loading: boolean;
}) => {
	return !weather ? (
		<Skeleton className="w-full h-[264px] p-6" />
	) : (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-semibold">{weather.city}</h2>
				<div className="flex items-center">
					<WeatherIcon
						condition={weather.condition.text.toLowerCase()}
					/>
					<span className="ml-2 text-gray-600">
						{weather.condition.text}
					</span>
				</div>
			</div>

			<div className="text-5xl font-bold text-center mb-4">
				{units === "metric" ? weather.temp_c : weather.temp_f}°
				{units === "metric" ? "C" : "F"}
			</div>

			<div className="text-center text-gray-500 mb-4">
				Terasa seperti:{" "}
				{units === "metric" ? weather.feelslike_c : weather.feelslike_f}
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
	);
};

export default CurrentWeather;
