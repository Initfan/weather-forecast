import { ForecastData } from "@/utils/type";
import React from "react";
import WeatherIcon from "@/components/WeatherIcon";
import { Skeleton } from "@/components/ui/skeleton";

const Forecast = ({
	forecast,
	units,
	loading,
}: {
	forecast: ForecastData[];
	units: "metric" | "imperial";
	loading: boolean;
}) => {
	return forecast.length == 0 ? (
		<Skeleton className="w-full h-[200px]"></Skeleton>
	) : (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h3 className="text-xl font-semibold mb-4">Perkiraan 5 Hari</h3>
			<div className="grid grid-cols-5 gap-2">
				{forecast.map((day, index) => (
					<div key={index} className="flex flex-col items-center p-2">
						<div className="font-medium">
							{new Date(day.date).toLocaleDateString("id-ID", {
								day: "2-digit",
								weekday: "short",
							})}
						</div>
						<div className="my-2">
							<WeatherIcon
								condition={day.day.condition.text.toLowerCase()}
							/>
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
	);
};

export default Forecast;
