import {
	Sun,
	Cloud,
	CloudRain,
	CloudSnow,
	Snowflake,
	CloudFog,
} from "lucide-react";
import React from "react";

const WeatherIcon = ({ condition }: { condition: string }) => {
	if (condition.includes("rain")) {
		return <CloudRain size={32} className="text-blue-500" />;
	} else if (condition.includes("snow")) {
		return <CloudSnow size={32} className="text-blue-200" />;
	} else if (condition.includes("mist")) {
		return <CloudFog size={32} className="text-gray-500" />;
	} else if (condition.includes("sunny")) {
		return <Sun size={32} className="text-yellow-500" />;
	} else if (condition.includes("cloudy")) {
		return <Cloud size={32} className="text-gray-500" />;
	} else if (condition.includes("ice")) {
		return <Snowflake size={32} className="text-gray-500" />;
	}
};

export default WeatherIcon;
