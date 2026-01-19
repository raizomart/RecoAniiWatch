import { useState, useEffect } from 'react';
import { Heart, Star, Eye, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Character {
  mal_id: number;
  name: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  favorites: number;
}

interface CharacterWithStats extends Character {
  likes: number;
  favoriteVotes: number;
  views: number;
  userLiked: boolean;
  userFavorited: boolean;
}

export function CharacterRankings() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CharacterWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'likes' | 'favorites' | 'views'>('likes');

  useEffect(() => {
    loadCharacters();
  }, [sortBy, user]);

  async function loadCharacters() {
    setLoading(true);
    try {
      const response = await fetch('https://api.jikan.moe/v4/characters?order_by=favorites&sort=desc&limit=24');
      const data = await response.json();

      const charactersData = data.data || [];

      const [likesData, favoritesData, viewsData] = await Promise.all([
        supabase
          .from('character_votes')
          .select('character_id, user_id')
          .eq('vote_type', 'like'),
        supabase
          .from('character_votes')
          .select('character_id, user_id')
          .eq('vote_type', 'favorite'),
        supabase
          .from('character_views')
          .select('character_id, view_count')
      ]);

      const likesMap = new Map<number, { count: number; userVoted: boolean }>();
      const favoritesMap = new Map<number, { count: number; userVoted: boolean }>();
      const viewsMap = new Map<number, number>();

      likesData.data?.forEach((vote) => {
        const current = likesMap.get(vote.character_id) || { count: 0, userVoted: false };
        current.count++;
        if (user && vote.user_id === user.id) current.userVoted = true;
        likesMap.set(vote.character_id, current);
      });

      favoritesData.data?.forEach((vote) => {
        const current = favoritesMap.get(vote.character_id) || { count: 0, userVoted: false };
        current.count++;
        if (user && vote.user_id === user.id) current.userVoted = true;
        favoritesMap.set(vote.character_id, current);
      });

      viewsData.data?.forEach((view) => {
        viewsMap.set(view.character_id, view.view_count);
      });

      const enrichedCharacters: CharacterWithStats[] = charactersData.map((char: Character) => ({
        ...char,
        likes: likesMap.get(char.mal_id)?.count || 0,
        favoriteVotes: favoritesMap.get(char.mal_id)?.count || 0,
        views: viewsMap.get(char.mal_id) || 0,
        userLiked: likesMap.get(char.mal_id)?.userVoted || false,
        userFavorited: favoritesMap.get(char.mal_id)?.userVoted || false
      }));

      const sortedCharacters = enrichedCharacters.sort((a, b) => {
        if (sortBy === 'likes') return b.likes - a.likes;
        if (sortBy === 'favorites') return b.favoriteVotes - a.favoriteVotes;
        return b.views - a.views;
      });

      setCharacters(sortedCharacters);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(character: CharacterWithStats, voteType: 'like' | 'favorite') {
    if (!user) return;

    const isCurrentlyVoted = voteType === 'like' ? character.userLiked : character.userFavorited;

    if (isCurrentlyVoted) {
      await supabase
        .from('character_votes')
        .delete()
        .eq('character_id', character.mal_id)
        .eq('vote_type', voteType);
    } else {
      await supabase.from('character_votes').insert({
        user_id: user.id,
        character_id: character.mal_id,
        character_name: character.name,
        character_image: character.images.jpg.image_url,
        anime_id: 0,
        anime_title: 'Various',
        vote_type: voteType
      });
    }

    loadCharacters();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Character Rankings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vote for your favorite anime characters and see how they rank
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSortBy('likes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === 'likes'
              ? 'bg-gradient-to-r from-pink-600 to-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          Most Liked
        </button>
        <button
          onClick={() => setSortBy('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === 'favorites'
              ? 'bg-gradient-to-r from-yellow-600 to-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Star className="w-4 h-4" />
          Most Favorited
        </button>
        <button
          onClick={() => setSortBy('views')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === 'views'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Eye className="w-4 h-4" />
          Most Viewed
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character, index) => (
            <div
              key={character.mal_id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="relative">
                <img
                  src={character.images.jpg.image_url}
                  alt={character.name}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute top-2 left-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold rounded-lg px-3 py-1 shadow-lg flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  #{index + 1}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                  {character.name}
                </h3>
                <div className="flex items-center justify-between mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{character.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{character.favoriteVotes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{character.views}</span>
                  </div>
                </div>
                {user && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVote(character, 'like')}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${
                        character.userLiked
                          ? 'bg-gradient-to-r from-pink-600 to-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${character.userLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleVote(character, 'favorite')}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${
                        character.userFavorited
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${character.userFavorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
