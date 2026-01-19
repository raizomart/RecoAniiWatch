import { X, MapPin, Calendar, Code2 } from 'lucide-react';

interface CreatorProfileProps {
  onClose: () => void;
}

export function CreatorProfile({ onClose }: CreatorProfileProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-col items-center text-white">
            <div className="relative mb-4 group">
              <div className="absolute inset-0 bg-white rounded-full blur-lg opacity-50"></div>
              <div className="relative w-32 h-32 rounded-full shadow-2xl border-4 border-white overflow-hidden">
                <img
                  src="/profile-picture.jpg"
                  alt="Raymart Anthony A. Adarme"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-1">Raymart Anthony A. Adarme</h2>
            <p className="text-blue-100 text-sm mb-4">Full Stack Developer & Anime Enthusiast</p>

            <a
              href="https://raizomart.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors shadow-lg"
            >
              Visit Portfolio Website
            </a>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              About Me
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Passionate full-stack developer with a love for creating beautiful and functional web applications.
              When I'm not coding, you'll find me watching anime and exploring new technologies.
              I believe in writing clean, maintainable code and building experiences that users love.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Las Vegas, Nevada</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member since {new Date().getFullYear()}</span>
              </div>
            </div>
          </section>

          <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              Feel free to reach out if you'd like to collaborate on a project or just chat about anime and tech!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
