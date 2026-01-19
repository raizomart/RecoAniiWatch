import { Star, Calendar, Tv } from 'lucide-react';
import { AnimeData, StreamingData } from '../lib/jikanApi';

interface AnimeCardProps {
  anime: AnimeData;
  onClick: () => void;
  rank?: number;
  streaming?: StreamingData[];
}

export function AnimeCard({ anime, onClick, rank, streaming }: AnimeCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {rank && (
          <div className="absolute top-2 left-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold rounded-lg px-3 py-1 shadow-lg">
            #{rank}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
          {anime.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          {anime.score && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{anime.score.toFixed(1)}</span>
            </div>
          )}
          {anime.year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{anime.year}</span>
            </div>
          )}
        </div>
        {streaming && streaming.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Tv className="w-3 h-3" />
            <span className="truncate">{streaming.map(s => s.name).join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
