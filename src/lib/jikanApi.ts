const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export interface AnimeData {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  synopsis: string | null;
  background: string | null;
  year: number | null;
  season: string | null;
  episodes: number | null;
  status: string;
  rating: string | null;
  studios: Array<{ mal_id: number; name: string }>;
  genres: Array<{ mal_id: number; name: string }>;
  themes: Array<{ mal_id: number; name: string }>;
  demographics: Array<{ mal_id: number; name: string }>;
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  } | null;
}

export interface CharacterData {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  role: string;
  voice_actors: Array<{
    person: {
      mal_id: number;
      name: string;
    };
    language: string;
  }>;
}

export interface StreamingData {
  name: string;
  url: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        await delay(1000 * (i + 1));
        continue;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(500 * (i + 1));
    }
  }
}

export async function getTopAnime(page = 1): Promise<{ data: AnimeData[]; pagination: any }> {
  const response = await fetchWithRetry(`${JIKAN_BASE_URL}/top/anime?page=${page}&limit=24`);
  return response;
}

export async function getSeasonNow(): Promise<{ data: AnimeData[] }> {
  const response = await fetchWithRetry(`${JIKAN_BASE_URL}/seasons/now?limit=24`);
  return response;
}

export async function getAnimeByGenre(genreId: number, page = 1): Promise<{ data: AnimeData[] }> {
  const response = await fetchWithRetry(`${JIKAN_BASE_URL}/anime?genres=${genreId}&page=${page}&limit=24&order_by=popularity`);
  return response;
}

export async function searchAnime(query: string): Promise<{ data: AnimeData[] }> {
  const response = await fetchWithRetry(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=20&order_by=popularity`);
  return response;
}

export async function getAnimeDetails(id: number): Promise<{ data: AnimeData }> {
  const response = await fetchWithRetry(`${JIKAN_BASE_URL}/anime/${id}/full`);
  return response;
}

export async function getAnimeCharacters(id: number): Promise<{ data: CharacterData[] }> {
  const response = await fetchWithRetry(`${JIKAN_BASE_URL}/anime/${id}/characters`);
  return response;
}

export async function getRecommendations(id: number): Promise<{ data: Array<{ entry: AnimeData }> }> {
  const response = await fetchWithRetry(`${JIKAN_BASE_URL}/anime/${id}/recommendations`);
  return response;
}

export async function getAnimeStreaming(id: number): Promise<{ data: StreamingData[] }> {
  try {
    const response = await fetchWithRetry(`${JIKAN_BASE_URL}/anime/${id}/streaming`);
    return response;
  } catch (error) {
    return { data: [] };
  }
}

export const GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Thriller' },
  { id: 9, name: 'Ecchi' },
  { id: 62, name: 'Isekai' },
];
