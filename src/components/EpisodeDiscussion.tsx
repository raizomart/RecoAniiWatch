import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Smile, Heart, Fire, Eye, EyeOff, Send, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AnimeData } from '../lib/jikanApi';

interface EpisodeDiscussionProps {
  anime: AnimeData;
}

interface Discussion {
  id: string;
  anime_id: number;
  anime_title: string;
  episode_number: number;
  user_id: string;
  username: string;
  comment: string;
  is_spoiler: boolean;
  created_at: string;
  reactions: Reaction[];
}

interface Reaction {
  id: string;
  discussion_id: string;
  user_id: string;
  reaction: string;
}

const REACTION_EMOJIS = [
  { emoji: '👍', label: 'thumbs-up' },
  { emoji: '😂', label: 'laugh' },
  { emoji: '❤️', label: 'heart' },
  { emoji: '🔥', label: 'fire' },
  { emoji: '😢', label: 'sad' },
  { emoji: '😮', label: 'surprised' }
];

export function EpisodeDiscussion({ anime }: EpisodeDiscussionProps) {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [showSpoilers, setShowSpoilers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDiscussions();
  }, [selectedEpisode, anime.mal_id]);

  async function loadDiscussions() {
    setLoading(true);
    try {
      const { data: discussionsData } = await supabase
        .from('episode_discussions')
        .select('*')
        .eq('anime_id', anime.mal_id)
        .eq('episode_number', selectedEpisode)
        .order('created_at', { ascending: false });

      const { data: reactionsData } = await supabase
        .from('episode_reactions')
        .select('*');

      const discussionsWithReactions = (discussionsData || []).map((discussion) => ({
        ...discussion,
        reactions: (reactionsData || []).filter((r) => r.discussion_id === discussion.id)
      }));

      setDiscussions(discussionsWithReactions);
    } catch (error) {
      console.error('Error loading discussions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostComment() {
    if (!user || !newComment.trim()) return;

    try {
      await supabase.from('episode_discussions').insert({
        anime_id: anime.mal_id,
        anime_title: anime.title,
        episode_number: selectedEpisode,
        user_id: user.id,
        username: user.email?.split('@')[0] || 'Anonymous',
        comment: newComment.trim(),
        is_spoiler: isSpoiler
      });

      setNewComment('');
      setIsSpoiler(false);
      loadDiscussions();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  }

  async function handleReaction(discussionId: string, emoji: string) {
    if (!user) return;

    try {
      const existing = discussions
        .find((d) => d.id === discussionId)
        ?.reactions.find((r) => r.user_id === user.id && r.reaction === emoji);

      if (existing) {
        await supabase.from('episode_reactions').delete().eq('id', existing.id);
      } else {
        await supabase.from('episode_reactions').insert({
          discussion_id: discussionId,
          user_id: user.id,
          reaction: emoji
        });
      }

      loadDiscussions();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  }

  async function handleDeleteComment(discussionId: string) {
    if (!user) return;

    try {
      await supabase.from('episode_discussions').delete().eq('id', discussionId);
      loadDiscussions();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  function toggleSpoiler(discussionId: string) {
    setShowSpoilers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(discussionId)) {
        newSet.delete(discussionId);
      } else {
        newSet.add(discussionId);
      }
      return newSet;
    });
  }

  const episodes = anime.episodes || 24;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Episode Discussions
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Episode
        </label>
        <select
          value={selectedEpisode}
          onChange={(e) => setSelectedEpisode(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        >
          {Array.from({ length: episodes }, (_, i) => i + 1).map((ep) => (
            <option key={ep} value={ep}>
              Episode {ep}
            </option>
          ))}
        </select>
      </div>

      {user && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this episode..."
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
                className="rounded"
              />
              Mark as spoiler
            </label>
            <button
              onClick={handlePostComment}
              disabled={!newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              <Send className="w-4 h-4" />
              Post Comment
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No discussions yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {discussion.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {discussion.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(discussion.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {user && discussion.user_id === user.id && (
                  <button
                    onClick={() => handleDeleteComment(discussion.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>

              {discussion.is_spoiler && !showSpoilers.has(discussion.id) ? (
                <button
                  onClick={() => toggleSpoiler(discussion.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  Show Spoiler
                </button>
              ) : (
                <>
                  {discussion.is_spoiler && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium">
                        SPOILER
                      </span>
                      <button
                        onClick={() => toggleSpoiler(discussion.id)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                      >
                        Hide
                      </button>
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                    {discussion.comment}
                  </p>
                </>
              )}

              <div className="flex gap-2 flex-wrap">
                {REACTION_EMOJIS.map((emoji) => {
                  const count = discussion.reactions.filter((r) => r.reaction === emoji.label).length;
                  const userReacted = user && discussion.reactions.some(
                    (r) => r.user_id === user.id && r.reaction === emoji.label
                  );

                  return (
                    <button
                      key={emoji.label}
                      onClick={() => user && handleReaction(discussion.id, emoji.label)}
                      disabled={!user}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-all ${
                        userReacted
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                          : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'
                      } ${!user ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span>{emoji.emoji}</span>
                      {count > 0 && <span className="text-gray-700 dark:text-gray-300">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
