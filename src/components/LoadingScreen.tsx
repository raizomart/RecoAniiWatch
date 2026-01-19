import { Tv, Sparkles, Star } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-300 rounded-full blur-2xl animate-float-medium" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-white/30 animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 16 + 8}px`,
              height: `${Math.random() * 16 + 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="flex justify-center mb-8">
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse-ring" />
            <Tv className="w-24 h-24 text-white animate-pulse-slow relative z-10" />
            <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-spin-slow" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full animate-ping" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in tracking-tight">
          <span className="inline-block animate-letter-bounce-1">R</span>
          <span className="inline-block animate-letter-bounce-2">e</span>
          <span className="inline-block animate-letter-bounce-3">c</span>
          <span className="inline-block animate-letter-bounce-4">o</span>
          <span className="inline-block animate-letter-bounce-5">A</span>
          <span className="inline-block animate-letter-bounce-6">n</span>
          <span className="inline-block animate-letter-bounce-7">i</span>
          <span className="inline-block animate-letter-bounce-8">W</span>
          <span className="inline-block animate-letter-bounce-1">a</span>
          <span className="inline-block animate-letter-bounce-2">t</span>
          <span className="inline-block animate-letter-bounce-3">c</span>
          <span className="inline-block animate-letter-bounce-4">h</span>
        </h1>

        <p className="text-xl text-white/90 mb-8 animate-fade-in-delay">
          Discovering your next favorite anime...
        </p>

        <div className="flex justify-center gap-2 animate-fade-in-delay-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce-1" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce-2" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce-3" />
        </div>

        <div className="mt-8 animate-fade-in-delay-3">
          <div className="h-2 w-48 mx-auto bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 animate-progress" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, -30px);
          }
        }

        @keyframes float-slower {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-40px, 40px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-dots {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-12px);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.3s forwards;
        }

        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.6s forwards;
        }

        .animate-bounce-1 {
          animation: bounce-dots 1.4s ease-in-out infinite;
        }

        .animate-bounce-2 {
          animation: bounce-dots 1.4s ease-in-out 0.2s infinite;
        }

        .animate-bounce-3 {
          animation: bounce-dots 1.4s ease-in-out 0.4s infinite;
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -20px);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
        }

        @keyframes letter-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }

        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.9s forwards;
        }

        .animate-letter-bounce-1 {
          animation: letter-bounce 1s ease-in-out 0.1s infinite;
        }

        .animate-letter-bounce-2 {
          animation: letter-bounce 1s ease-in-out 0.15s infinite;
        }

        .animate-letter-bounce-3 {
          animation: letter-bounce 1s ease-in-out 0.2s infinite;
        }

        .animate-letter-bounce-4 {
          animation: letter-bounce 1s ease-in-out 0.25s infinite;
        }

        .animate-letter-bounce-5 {
          animation: letter-bounce 1s ease-in-out 0.3s infinite;
        }

        .animate-letter-bounce-6 {
          animation: letter-bounce 1s ease-in-out 0.35s infinite;
        }

        .animate-letter-bounce-7 {
          animation: letter-bounce 1s ease-in-out 0.4s infinite;
        }

        .animate-letter-bounce-8 {
          animation: letter-bounce 1s ease-in-out 0.45s infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
