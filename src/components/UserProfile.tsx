import { useState, useEffect } from 'react';
import { User as UserIcon, X, Mail, Calendar, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfileProps {
  onClose: () => void;
}

interface UserStats {
  watching: number;
  completed: number;
  plan_to_watch: number;
  dropped: number;
  total: number;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    watching: 0,
    completed: 0,
    plan_to_watch: 0,
    dropped: 0,
    total: 0,
  });

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  async function loadStats() {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_watchlist')
        .select('status');

      if (data) {
        const newStats = {
          watching: data.filter(d => d.status === 'watching').length,
          completed: data.filter(d => d.status === 'completed').length,
          plan_to_watch: data.filter(d => d.status === 'plan_to_watch').length,
          dropped: data.filter(d => d.status === 'dropped').length,
          total: data.length,
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  if (!user) return null;

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-cyan-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-16 relative z-10">
          <div className="flex items-end gap-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Anime Fan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Member</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm">Joined {joinDate}</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Watchlist Stats
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-cyan-400">
                  {stats.watching}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Watching</div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.completed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.plan_to_watch}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Plan to Watch</div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
