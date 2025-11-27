"use server";

export interface WeatherData {
    temperature: number;
    weatherCode: number;
    humidity: number;
}

export async function getWeatherData(): Promise<WeatherData | null> {
    const latitude = 38.7135;
    const longitude = -77.7953;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m&temperature_unit=fahrenheit`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 600 } // Cache for 10 minutes
        });

        if (!response.ok) {
            console.error('Failed to fetch weather data:', response.statusText);
            return null;
        }

        const data = await response.json();

        return {
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weather_code,
            humidity: data.current.relative_humidity_2m,
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
