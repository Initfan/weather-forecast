export interface ForecastData {
	// day: string;
	// temp: string | number;
	// condition: string;
	date: Date;
	day: {
		maxtemp_c: number;
		mintemp_c: number;
		maxtemp_f: number;
		mintemp_f: number;
		avgtemp_c: number;
		avgtemp_f: number;
		maxwind_kph: number;
		maxwind_mph: number;
		totalprecip_mm: number;
		totalprecip_in: number;
		avgtemp: number;
		maxwind: number;
		totalprecip: number;
		avghumidity: number;
		condition: {
			code: number;
			icon: string;
			text: string;
		};
	};
}

export interface CurrentWeatherData {
	city: string;
	cloud: number;
	condition: {
		code: number;
		icon: string;
		text: string;
	};
	is_day: boolean;
	temp_c: number;
	temp_f: number;
	wind_mph: number;
	wind_kph: number;
	humidity: number;
	feelslike_c: number;
	feelslike_f: number;
}
