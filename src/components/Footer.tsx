import { Heart, Github, Linkedin, Mail, Code } from 'lucide-react';

interface FooterProps {
  onCreatorClick: () => void;
}

export function Footer({ onCreatorClick }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              About RecoAniWatch
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for discovering and tracking anime. Built with passion for the anime community.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Browse Top Anime</li>
              <li>Search & Filter by Genre</li>
              <li>Personal Watchlist</li>
              <li>Anime Details & Trailers</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Data Source
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-2">
              Powered by Jikan API - the unofficial MyAnimeList API
            </p>
            <a
              href="https://jikan.moe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-cyan-400 hover:underline text-sm"
            >
              Learn more about Jikan
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Created By
              </h4>
            </div>

            <button
              onClick={onCreatorClick}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-32 h-32 rounded-full shadow-xl border-4 border-white dark:border-gray-900 overflow-hidden group-hover:scale-105 transition-transform">
                  <img
                    src="/profile-picture.jpg"
                    alt="Raymart Anthony A. Adarme"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  Raymart Anthony A. Adarme
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Full Stack Developer & Anime Enthusiast
                </p>
                <p className="text-blue-600 dark:text-cyan-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view profile
                </p>
              </div>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="mailto:your.email@example.com"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
              <span>using React, TypeScript & Supabase</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} RecoAniWatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
