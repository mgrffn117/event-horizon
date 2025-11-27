import CommandPalette from './components/CommandPalette';
import WeatherWidget from './components/WeatherWidget';
import NewsWidget from './components/NewsWidget';
import OperationsGrid from './components/OperationsGrid';
import StorageWidget from './components/StorageWidget';
import FamilyWidget from './components/FamilyWidget';
import { getRunningContainers, getContainers } from '../actions/docker';
import { getWeatherData } from '../actions/weather';
import { getAINews } from '../actions/news';
import { getStorageStats } from '../actions/system';
import { getTodos } from '../actions/todos';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const runningContainers = await getRunningContainers();
  const [weatherData, newsData, containers, storageStats, initialTodos] = await Promise.all([
    getWeatherData(),
    getAINews(),
    getContainers(),
    getStorageStats(),
    getTodos(),
  ]);

  return (
    <>
      <CommandPalette containers={runningContainers} />

      <main className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Event Horizon
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Container Monitoring Dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-slate-500">Live</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-slate-900/50 border border-white/10 rounded text-slate-500">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            </div>
          </div>

          {/* Quadrant Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

            {/* Left Column - Info Widgets */}
            <div className="space-y-6 lg:col-span-4">
              {weatherData && <WeatherWidget data={weatherData} />}
              <NewsWidget news={newsData} />
              <StorageWidget stats={storageStats} />
              <FamilyWidget initialTodos={initialTodos} />
            </div>

            {/* Right Column: Operations Quadrant */}
            <div className="lg:col-span-8">
              {/* Operations Grid */}
              <OperationsGrid initialContainers={containers} />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
