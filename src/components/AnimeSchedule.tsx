import { useState, useEffect } from 'react';
import { Calendar, Clock, Tv2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeData } from '../lib/jikanApi';
import { AnimeCard } from './AnimeCard';

interface AnimeScheduleProps {
  onAnimeClick: (anime: AnimeData) => void;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AnimeSchedule({ onAnimeClick }: AnimeScheduleProps) {
  const [scheduleData, setScheduleData] = useState<Record<string, AnimeData[]>>({});
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  useEffect(() => {
    loadSchedule();
  }, []);

  async function loadSchedule() {
    setLoading(true);
    try {
      const response = await fetch('https://api.jikan.moe/v4/schedules');
      const data = await response.json();

      const schedule: Record<string, AnimeData[]> = {};
      DAYS.forEach((day) => {
        schedule[day] = data.data.filter((anime: AnimeData & { broadcast?: { day: string } }) =>
          anime.broadcast?.day?.toLowerCase() === day
        );
      });

      setScheduleData(schedule);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  }

  function nextDay() {
    setSelectedDay((prev) => (prev + 1) % 7);
  }

  function prevDay() {
    setSelectedDay((prev) => (prev - 1 + 7) % 7);
  }

  function getCurrentDayAnime() {
    return scheduleData[DAYS[selectedDay]] || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
          <Calendar className="w-10 h-10 text-blue-600 dark:text-cyan-400" />
          Anime Release Schedule
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track upcoming episode releases and airing times
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('week')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            viewMode === 'week'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Week View
        </button>
        <button
          onClick={() => setViewMode('day')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            viewMode === 'day'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Day View
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : viewMode === 'week' ? (
        <div className="space-y-8">
          {DAYS.map((day, index) => {
            const dayAnime = scheduleData[day] || [];
            const isToday = index === new Date().getDay() - 1 || (new Date().getDay() === 0 && index === 6);

            return (
              <div key={day} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isToday
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    <Tv2 className="w-5 h-5" />
                    <h2 className="text-xl font-bold">{DAY_NAMES[index]}</h2>
                    {isToday && (
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs font-medium">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {dayAnime.length} anime airing
                  </span>
                </div>

                {dayAnime.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No anime scheduled for this day
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {dayAnime.slice(0, 6).map((anime) => (
                      <AnimeCard key={anime.mal_id} anime={anime} onClick={() => onAnimeClick(anime)} />
                    ))}
                  </div>
                )}

                {dayAnime.length > 6 && (
                  <button
                    onClick={() => {
                      setSelectedDay(index);
                      setViewMode('day');
                    }}
                    className="mt-4 w-full py-2 text-center text-blue-600 dark:text-cyan-400 hover:underline font-medium"
                  >
                    View all {dayAnime.length} anime
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevDay}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg">
                <Calendar className="w-6 h-6" />
                <h2 className="text-2xl font-bold">{DAY_NAMES[selectedDay]}</h2>
              </div>
              <span className="text-lg text-gray-600 dark:text-gray-400">
                {getCurrentDayAnime().length} anime
              </span>
            </div>

            <button
              onClick={nextDay}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {getCurrentDayAnime().length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No anime scheduled for this day
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {getCurrentDayAnime().map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} onClick={() => onAnimeClick(anime)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
