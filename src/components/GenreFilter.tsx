import { GENRES } from '../lib/jikanApi';

interface GenreFilterProps {
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

export function GenreFilter({ selectedGenre, onGenreSelect }: GenreFilterProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Browse by Genre</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGenreSelect(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedGenre === null
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedGenre === genre.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}
