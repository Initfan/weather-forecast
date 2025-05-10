export interface WeatherData {
  city: string;
  temp: string | number;
  humidity: string | number;
  windSpeed: number;
  condition: string;
  feels_like: number;
}

export interface ForecastData {
  // day: string;
  // temp: string | number;
  // condition: string;
  date: Date;
  day: {
    maxtemp: number;
    mintemp: number;
    avgtemp: number;
    maxwind: number;
    totalprecip: number;
    avghumidity: number;
  };
  condition: {
    code: number;
    icon: string;
    text: string;
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
  temp: number;
  windSpeed: number;
  humidity: number;
  feelslike: number;
}
