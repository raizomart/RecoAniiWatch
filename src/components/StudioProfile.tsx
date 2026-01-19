import { useState, useEffect } from 'react';
import { X, Building2, Star, Calendar, TrendingUp } from 'lucide-react';
import { AnimeData } from '../lib/jikanApi';
import { AnimeCard } from './AnimeCard';

interface StudioProfileProps {
  studioId: number;
  studioName: string;
  onClose: () => void;
  onAnimeClick: (anime: AnimeData) => void;
}

interface StudioStats {
  totalAnime: number;
  averageScore: number;
  topRated: AnimeData[];
}

export function StudioProfile({ studioId, studioName, onClose, onAnimeClick }: StudioProfileProps) {
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [stats, setStats] = useState<StudioStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudioData();
  }, [studioId]);

  async function loadStudioData() {
    setLoading(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?producers=${studioId}&order_by=score&sort=desc&limit=24`);
      const data = await response.json();

      const anime = data.data || [];
      setAnimeList(anime);

      const validScores = anime.filter((a: AnimeData) => a.score).map((a: AnimeData) => a.score);
      const avgScore = validScores.length > 0
        ? validScores.reduce((a: number, b: number) => a + b, 0) / validScores.length
        : 0;

      setStats({
        totalAnime: anime.length,
        averageScore: avgScore,
        topRated: anime.slice(0, 6)
      });
    } catch (error) {
      console.error('Error loading studio data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
            <div className="text-center">
              <Building2 className="w-20 h-20 text-white mx-auto mb-4" />
              <h1 className="text-5xl font-bold text-white">{studioName}</h1>
            </div>
          </div>

          <div className="px-8 py-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                      <Calendar className="w-8 h-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.totalAnime}</div>
                      <div className="text-sm opacity-90">Total Anime</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                      <Star className="w-8 h-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.averageScore.toFixed(2)}</div>
                      <div className="text-sm opacity-90">Average Score</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                      <TrendingUp className="w-8 h-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.topRated.length}</div>
                      <div className="text-sm opacity-90">Top Rated Shows</div>
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Top Rated Anime</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {stats?.topRated.map((anime) => (
                      <AnimeCard key={anime.mal_id} anime={anime} onClick={() => onAnimeClick(anime)} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">All Anime by {studioName}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {animeList.map((anime) => (
                      <AnimeCard key={anime.mal_id} anime={anime} onClick={() => onAnimeClick(anime)} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
