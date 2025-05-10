export interface WeatherData {
  city: string;
  temp: string | number;
  humidity: string | number;
  windSpeed: number;
  condition: string;
  feels_like: number;
}

export interface ForecastData {
  day: string;
  temp: string | number;
  condition: string;
}

export interface CurrentWeatherData {
  cloud: number;
  condition: {
    code: number;
    icon: string;
    text: string;
  };
  is_day: boolean;
  temp_c: number;
  temp_f: number;
  wind_kph: number;
  wind_mph: number;
  humidity: number;
  feelslike_c: number;
}
