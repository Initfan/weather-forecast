export interface WeatherData  {
    city: string;
    temp: string | number;
    humidity: string | number;
    windSpeed: number;
    condition: string;
    feels_like: number;
}

export interface ForecastData {
    day: string; temp: string | number; condition: string;}