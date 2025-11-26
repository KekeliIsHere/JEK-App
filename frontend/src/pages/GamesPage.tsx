import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

interface GamesPageProps {
  studentName: string;
  userStats?: UserStats;
  onUpdateStats?: (stats: UserStats) => void;
}

const games = [
  {
    id: "game-truth-tables",
    title: "Truth Table Challenge",
    description: "Build and complete truth tables as fast as you can.",
    type: "Speed Challenge",
    xp: 100,
  },
  {
    id: "game-matching",
    title: "Logic Matching",
    description: "Match equivalent statements and expressions.",
    type: "Puzzle",
    xp: 80,
  },
  {
    id: "game-proof-rush",
    title: "Proof Rush",
    description: "Construct logical proofs under time pressure.",
    type: "Speed Challenge",
    xp: 150,
  },
];

export default function GamesPage({ studentName, userStats }: GamesPageProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const locked = !userStats || (userStats.completedLessons || []).length === 0;

  const handlePlayGame = (id: string) => {
    if (locked) return;
    navigate(`/game/${id}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8faf9] to-[#e8f5e9] flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="games" />

      {/* Main content */}
      <main className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 md:ml-64 bg-transparent">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-xl bg-white shadow-md text-[#060404] hover:bg-[#68ba4a] hover:text-white transition-all"
                aria-label="Toggle Menu"
              >
                <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm text-[#8baab1] hover:underline"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Games</h1>
            <p className="text-sm text-[#060404]/70 mt-1">
              Learn while you play. Unlock achievements and compete on the leaderboard.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#8baab1] text-white flex items-center justify-center font-semibold">
            {studentName[0]?.toUpperCase() ?? "S"}
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-4 flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">{game.title}</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#8baab1] text-white">
                    {game.type}
                  </span>
                </div>
                <p className="text-sm text-[#060404]/80">{game.description}</p>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-[#f4f7f4]">
                    🎮 {game.type}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[#f4f7f4]">
                    ✨ {game.xp} XP
                  </span>
                </div>
                <button
                  onClick={() => handlePlayGame(game.id)}
                  disabled={locked}
                  className={`w-full px-3 py-2 rounded-full text-white text-sm font-semibold transition ${locked ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#68ba4a] hover:opacity-90"}`}
                >
                  {locked ? "🔒 Locked" : "Play Game"}
                </button>
              </div>
            ))}
          </div>
        </main>
      </main>
    </div>
  );
}
