import React from 'react';
import {
    Sun,
    Cloud,
    CloudFog,
    CloudRain,
    CloudDrizzle,
    CloudSnow,
    Snowflake,
    CloudLightning,
    Droplets
} from 'lucide-react';
import { WeatherData } from '../../actions/weather';

interface WeatherWidgetProps {
    data: WeatherData;
}

const getWeatherIcon = (code: number) => {
    if (code === 0) return Sun;
    if (code >= 1 && code <= 3) return Cloud;
    if (code >= 45 && code <= 48) return CloudFog;
    if (code >= 51 && code <= 57) return CloudDrizzle;
    if (code >= 61 && code <= 67) return CloudRain;
    if (code >= 71 && code <= 77) return Snowflake;
    if (code >= 80 && code <= 82) return CloudRain;
    if (code >= 85 && code <= 86) return CloudSnow;
    if (code >= 95 && code <= 99) return CloudLightning;
    return Cloud;
};

const WeatherWidget = ({ data }: WeatherWidgetProps) => {
    const WeatherIcon = getWeatherIcon(data.weatherCode);

    return (
        <div className="glass-card p-6">
            <div className="text-xs text-slate-500 mb-4">Warrenton, VA</div>

            <div className="flex items-center justify-between">
                {/* Temperature */}
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                        {Math.round(data.temperature)}
                    </span>
                    <span className="text-xl text-slate-400">°F</span>
                </div>

                {/* Weather Icon */}
                <WeatherIcon className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />

                {/* Humidity */}
                <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">{data.humidity}%</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
