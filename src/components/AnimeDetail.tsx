import { useState, useEffect } from 'react';
import { X, Star, Calendar, Tv2, Building2, Heart, Plus, Check, ExternalLink } from 'lucide-react';
import { AnimeData, CharacterData, StreamingData, getAnimeCharacters, getRecommendations, getAnimeStreaming } from '../lib/jikanApi';
import { useAuth } from '../contexts/AuthContext';
import { supabase, WatchlistStatus } from '../lib/supabase';
import { AnimeCard } from './AnimeCard';
import { EpisodeDiscussion } from './EpisodeDiscussion';

interface AnimeDetailProps {
  anime: AnimeData;
  onClose: () => void;
  onAnimeClick: (anime: AnimeData) => void;
}

export function AnimeDetail({ anime, onClose, onAnimeClick }: AnimeDetailProps) {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeData[]>([]);
  const [streaming, setStreaming] = useState<StreamingData[]>([]);
  const [watchlistStatus, setWatchlistStatus] = useState<WatchlistStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [anime.mal_id, user]);

  async function loadData() {
    try {
      const [charRes, recRes, streamRes] = await Promise.all([
        getAnimeCharacters(anime.mal_id),
        getRecommendations(anime.mal_id),
        getAnimeStreaming(anime.mal_id),
      ]);
      setCharacters(charRes.data.slice(0, 12));
      setRecommendations(recRes.data.slice(0, 6).map(r => r.entry));
      setStreaming(streamRes.data);

      if (user) {
        const { data } = await supabase
          .from('user_watchlist')
          .select('status')
          .eq('anime_id', anime.mal_id)
          .maybeSingle();
        setWatchlistStatus(data?.status || null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async function toggleWatchlist(status: WatchlistStatus) {
    if (!user) return;
    setLoading(true);
    try {
      if (watchlistStatus) {
        if (watchlistStatus === status) {
          await supabase.from('user_watchlist').delete().eq('anime_id', anime.mal_id);
          setWatchlistStatus(null);
        } else {
          await supabase
            .from('user_watchlist')
            .update({ status })
            .eq('anime_id', anime.mal_id);
          setWatchlistStatus(status);
        }
      } else {
        await supabase.from('user_watchlist').insert({
          user_id: user.id,
          anime_id: anime.mal_id,
          anime_title: anime.title,
          anime_image: anime.images.jpg.image_url,
          status,
        });
        setWatchlistStatus(status);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  }

  const allGenres = [...anime.genres, ...anime.themes, ...anime.demographics];

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

          <div className="relative h-96 overflow-hidden">
            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent" />
          </div>

          <div className="px-8 pb-8 -mt-32 relative z-10">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className="w-48 h-64 object-cover rounded-xl shadow-2xl"
              />

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {anime.title}
                </h1>
                {anime.title_english && anime.title_english !== anime.title && (
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{anime.title_english}</p>
                )}

                <div className="flex flex-wrap gap-4 mb-4">
                  {anime.score && (
                    <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-lg">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900 dark:text-gray-100">{anime.score.toFixed(1)}</span>
                    </div>
                  )}
                  {anime.rank && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                      <span className="font-bold text-gray-900 dark:text-gray-100">Rank #{anime.rank}</span>
                    </div>
                  )}
                  {anime.year && (
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">{anime.year}</span>
                    </div>
                  )}
                  {anime.episodes && (
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                      <Tv2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">{anime.episodes} episodes</span>
                    </div>
                  )}
                </div>

                {user && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => toggleWatchlist('watching')}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        watchlistStatus === 'watching'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {watchlistStatus === 'watching' ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      Watching
                    </button>
                    <button
                      onClick={() => toggleWatchlist('completed')}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        watchlistStatus === 'completed'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {watchlistStatus === 'completed' ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      Completed
                    </button>
                    <button
                      onClick={() => toggleWatchlist('plan_to_watch')}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        watchlistStatus === 'plan_to_watch'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {watchlistStatus === 'plan_to_watch' ? <Heart className="w-4 h-4 fill-current" /> : <Heart className="w-4 h-4" />}
                      Plan to Watch
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {allGenres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-blue-600 dark:text-cyan-400 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {anime.studios.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>{anime.studios.map(s => s.name).join(', ')}</span>
                  </div>
                )}

                {streaming.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Available on:</h3>
                    <div className="flex flex-wrap gap-2">
                      {streaming.map((platform, index) => (
                        <a
                          key={index}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-600 transition-all shadow-sm"
                        >
                          {platform.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {anime.trailer?.embed_url && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Trailer</h2>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={anime.trailer.embed_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Synopsis</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {anime.synopsis || 'No synopsis available.'}
              </p>
            </div>

            {anime.background && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Background</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {anime.background}
                </p>
              </div>
            )}

            {characters.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Characters</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {characters.map((char) => (
                    <div key={char.character.mal_id} className="text-center">
                      <img
                        src={char.character.images.jpg.image_url}
                        alt={char.character.name}
                        className="w-full aspect-[3/4] object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                        {char.character.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{char.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recommendations</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendations.map((rec) => (
                    <AnimeCard key={rec.mal_id} anime={rec} onClick={() => onAnimeClick(rec)} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <EpisodeDiscussion anime={anime} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
