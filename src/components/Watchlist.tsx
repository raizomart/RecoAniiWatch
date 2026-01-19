import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, WatchlistItem } from '../lib/supabase';
import { AnimeData } from '../lib/jikanApi';

interface WatchlistProps {
  onAnimeClick: (animeId: number) => void;
}

export function Watchlist({ onAnimeClick }: WatchlistProps) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user]);

  async function loadWatchlist() {
    try {
      const { data, error } = await supabase
        .from('user_watchlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Sign in to view your watchlist</p>
      </div>
    );
  }

  const filteredWatchlist = filter === 'all'
    ? watchlist
    : watchlist.filter(item => item.status === filter);

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">My Watchlist</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'watching', 'completed', 'plan_to_watch', 'dropped'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              filter === status
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredWatchlist.length === 0 ? (
        <p className="text-center py-12 text-gray-600 dark:text-gray-400">
          No anime in this category
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredWatchlist.map((item) => (
            <div
              key={item.id}
              onClick={() => onAnimeClick(item.anime_id)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-2">
                <img
                  src={item.anime_image || ''}
                  alt={item.anime_title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                {item.anime_title}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {item.status.replace('_', ' ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
