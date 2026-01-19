import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AnimeCard } from './components/AnimeCard';
import { GenreFilter } from './components/GenreFilter';
import { AnimeDetail } from './components/AnimeDetail';
import { AuthModal } from './components/AuthModal';
import { Watchlist } from './components/Watchlist';
import { LoadingScreen } from './components/LoadingScreen';
import { UserProfile } from './components/UserProfile';
import { Footer } from './components/Footer';
import { CreatorProfile } from './components/CreatorProfile';
import { CharacterRankings } from './components/CharacterRankings';
import { AnimeSchedule } from './components/AnimeSchedule';
import { StudioProfile } from './components/StudioProfile';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import {
  AnimeData,
  getTopAnime,
  getSeasonNow,
  getAnimeByGenre,
  searchAnime,
  getAnimeDetails,
} from './lib/jikanApi';
import { TrendingUp, Clock, Sparkles } from 'lucide-react';

type View = 'home' | 'watchlist' | 'characters' | 'schedule';

function AppContent() {
  const [view, setView] = useState<View>('home');
  const [topAnime, setTopAnime] = useState<AnimeData[]>([]);
  const [seasonAnime, setSeasonAnime] = useState<AnimeData[]>([]);
  const [genreAnime, setGenreAnime] = useState<AnimeData[]>([]);
  const [searchResults, setSearchResults] = useState<AnimeData[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<AnimeData | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const [showStudioProfile, setShowStudioProfile] = useState<{ id: number; name: string } | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setShowResetPassword(true);
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedGenre !== null) {
      loadGenreAnime(selectedGenre);
    }
  }, [selectedGenre]);

  async function loadInitialData() {
    try {
      const [topRes, seasonRes] = await Promise.all([
        getTopAnime(1),
        getSeasonNow(),
      ]);
      setTopAnime(topRes.data);
      setSeasonAnime(seasonRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadGenreAnime(genreId: number) {
    try {
      const res = await getAnimeByGenre(genreId);
      setGenreAnime(res.data);
    } catch (error) {
      console.error('Error loading genre anime:', error);
    }
  }

  async function handleSearch(query: string) {
    if (!query.trim()) return;
    try {
      const res = await searchAnime(query);
      setSearchResults(res.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  }

  async function handleAnimeClick(anime: AnimeData | number) {
    try {
      const id = typeof anime === 'number' ? anime : anime.mal_id;
      const res = await getAnimeDetails(id);
      setSelectedAnime(res.data);
    } catch (error) {
      console.error('Error loading anime details:', error);
    }
  }

  const displayedAnime = searchQuery.trim()
    ? searchResults
    : selectedGenre !== null
    ? genreAnime
    : [];

  if (loading) {
    return <LoadingScreen />;
  }

  if (showResetPassword) {
    return <ResetPasswordPage onComplete={() => {
      setShowResetPassword(false);
      window.location.hash = '';
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        onSearch={setSearchQuery}
        onAuthClick={() => setShowAuth(true)}
        onProfileClick={() => setShowProfile(true)}
        searchQuery={searchQuery}
        onLogoClick={() => {
          setView('home');
          setSearchQuery('');
          setSelectedGenre(null);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setView('home')}
            className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              view === 'home'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setView('watchlist')}
            className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              view === 'watchlist'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            My Watchlist
          </button>
          <button
            onClick={() => setView('characters')}
            className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              view === 'characters'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Character Rankings
          </button>
          <button
            onClick={() => setView('schedule')}
            className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              view === 'schedule'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Schedule
          </button>
        </div>

        {view === 'watchlist' ? (
          <Watchlist onAnimeClick={handleAnimeClick} />
        ) : view === 'characters' ? (
          <CharacterRankings />
        ) : view === 'schedule' ? (
          <AnimeSchedule onAnimeClick={handleAnimeClick} />
        ) : (
          <>
            {!searchQuery && !selectedGenre && (
              <>
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Top Anime
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {topAnime.slice(0, 12).map((anime, index) => (
                      <AnimeCard
                        key={anime.mal_id}
                        anime={anime}
                        onClick={() => handleAnimeClick(anime)}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                </section>

                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      This Season
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {seasonAnime.slice(0, 12).map((anime) => (
                      <AnimeCard
                        key={anime.mal_id}
                        anime={anime}
                        onClick={() => handleAnimeClick(anime)}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}

            <GenreFilter
              selectedGenre={selectedGenre}
              onGenreSelect={setSelectedGenre}
            />

            {displayedAnime.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Browse by Genre'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {displayedAnime.map((anime) => (
                    <AnimeCard
                      key={anime.mal_id}
                      anime={anime}
                      onClick={() => handleAnimeClick(anime)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {selectedAnime && (
        <AnimeDetail
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
          onAnimeClick={handleAnimeClick}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      {showCreatorProfile && <CreatorProfile onClose={() => setShowCreatorProfile(false)} />}
      {showStudioProfile && (
        <StudioProfile
          studioId={showStudioProfile.id}
          studioName={showStudioProfile.name}
          onClose={() => setShowStudioProfile(null)}
          onAnimeClick={handleAnimeClick}
        />
      )}

      <Footer onCreatorClick={() => setShowCreatorProfile(true)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
