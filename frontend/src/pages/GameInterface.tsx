// src/pages/GameInterface.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

interface GameInterfaceProps {
  studentName: string;
  userStats?: UserStats;
  onUpdateStats?: (stats: UserStats) => void;
}

const GameInterface = ({ studentName, userStats, onUpdateStats }: GameInterfaceProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [gameState, setGameState] = useState<"playing" | "completed">("playing");
  const [score, setScore] = useState(0);

  const defaultGames: Record<
    string,
    {
      title: string;
      description: string;
      type: string;
      maxScore: number;
      instruction: string;
    }
  > = {
    "truth-table": {
      title: "Truth Table Challenge",
      description: "Complete truth tables by filling in the missing values",
      type: "Logic",
      maxScore: 100,
      instruction:
        "Complete the truth table by clicking the cells and filling in the correct truth values for each expression.",
    },
    "logic-matching": {
      title: "Logic Matching",
      description: "Match logical expressions to their equivalent forms",
      type: "Reasoning",
      maxScore: 80,
      instruction:
        "Drag and drop or click to match each logical statement with its equivalent expression.",
    },
    "proof-rush": {
      title: "Proof Rush",
      description: "Build logical proofs under time pressure",
      type: "Advanced",
      maxScore: 150,
      instruction:
        "Use the available rules and premises to construct a valid logical proof. Work quickly to earn bonus points!",
    },
  };

  // load admin-managed games from localStorage if present
  const stored = typeof window !== "undefined" ? localStorage.getItem("jek_games") : null;
  const games = stored ? JSON.parse(stored) : defaultGames;

  const game = games[id || ""] || (games as any)["truth-table"];

  const handlePlayGame = () => {
    // Simulate game play
    const randomScore = Math.floor(Math.random() * game.maxScore * 0.7) + game.maxScore * 0.3;
    setScore(randomScore);
    setGameState("completed");
  };

  const [appliedReward, setAppliedReward] = useState(false);

  useEffect(() => {
    if (gameState === "completed" && !appliedReward) {
      const xpEarned = Math.floor(score / 2);
      if (onUpdateStats && userStats) {
        const updated: UserStats = {
          ...userStats,
          xp: userStats.xp + xpEarned,
          level: Math.floor((userStats.xp + xpEarned) / 100),
          completedLessons: userStats.completedLessons,
        };
        onUpdateStats(updated);
      }
      setAppliedReward(true);
    }
  }, [gameState, appliedReward]);

  const handlePlayAgain = () => {
    setGameState("playing");
    setScore(0);
  };

  if (gameState === "completed") {
    const xpEarned = Math.floor(score / 2);
    return (
      <div className="min-h-screen bg-[#fbf9f9] text-[#060404] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-[#b3ccb8]/40 p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold mb-2">Game Complete!</h1>
          </div>

          <div className="bg-[#f4f7f4] rounded-xl p-6 mb-6 space-y-4">
            <div>
              <p className="text-sm text-[#060404]/70 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-[#68ba4a]">{score}</p>
            </div>
            <div className="h-px bg-[#b3ccb8]/40" />
            <div>
              <p className="text-sm text-[#060404]/70 mb-1">XP Earned</p>
              <p className="text-2xl font-bold text-[#8baab1]">+{xpEarned} XP</p>
            </div>
          </div>

          <p className="text-lg font-semibold mb-6 text-[#68ba4a]">
            Excellent work, {studentName}!
          </p>

          <div className="space-y-3">
            <button
              onClick={handlePlayAgain}
              className="w-full px-6 py-3 rounded-xl bg-[#68ba4a] text-white font-semibold hover:bg-[#5a9a3d] transition"
            >
              🎮 Play Again
            </button>
            <button
              onClick={() => navigate("/games")}
              className="w-full px-6 py-3 rounded-xl bg-[#b3ccb8] text-[#060404] font-semibold hover:bg-[#a3bcb8] transition"
            >
              ← Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] text-[#060404]">
      {/* Header */}
      <header className="bg-white border-b border-[#b3ccb8]/40 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/games")}
              className="text-[#68ba4a] hover:text-[#5a9a3d] font-semibold text-sm mb-3 flex items-center gap-1"
            >
              ← Back to Games
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">{game.title}</h1>
            <p className="text-sm text-[#060404]/70 mt-1">{game.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#060404]/70">Player</p>
            <p className="text-lg font-semibold">{studentName}</p>
          </div>
        </div>
      </header>

      {/* Main game area */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-8 min-h-96 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {id === "truth-table" && "📊"}
                  {id === "logic-matching" && "🔗"}
                  {id === "proof-rush" && "⚡"}
                </div>
                <h2 className="text-2xl font-bold mb-4">{game.title}</h2>
                <p className="text-[#060404]/70 mb-8 max-w-md">{game.instruction}</p>

                {id === "truth-table" && (
                  <div className="bg-[#f4f7f4] rounded-lg p-4 mb-6 text-left">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#b3ccb8]">
                          <th className="px-2 py-2">p</th>
                          <th className="px-2 py-2">q</th>
                          <th className="px-2 py-2">p ∧ q</th>
                          <th className="px-2 py-2">p ∨ q</th>
                          <th className="px-2 py-2">p → q</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#b3ccb8]/30">
                          <td className="px-2 py-2">T</td>
                          <td className="px-2 py-2">T</td>
                          <td className="px-2 py-2 font-semibold text-[#68ba4a]">T</td>
                          <td className="px-2 py-2 font-semibold text-[#68ba4a]">T</td>
                          <td className="px-2 py-2 font-semibold text-[#68ba4a]">T</td>
                        </tr>
                        <tr className="border-b border-[#b3ccb8]/30">
                          <td className="px-2 py-2">T</td>
                          <td className="px-2 py-2">F</td>
                          <td className="px-2 py-2 bg-yellow-100 font-semibold">?</td>
                          <td className="px-2 py-2 font-semibold text-[#68ba4a]">T</td>
                          <td className="px-2 py-2 bg-yellow-100 font-semibold">?</td>
                        </tr>
                        <tr className="border-b border-[#b3ccb8]/30">
                          <td className="px-2 py-2">F</td>
                          <td className="px-2 py-2">T</td>
                          <td className="px-2 py-2 bg-yellow-100 font-semibold">?</td>
                          <td className="px-2 py-2 font-semibold text-[#68ba4a]">T</td>
                          <td className="px-2 py-2 font-semibold text-[#68ba4a]">T</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2">F</td>
                          <td className="px-2 py-2">F</td>
                          <td className="px-2 py-2 bg-yellow-100 font-semibold">?</td>
                          <td className="px-2 py-2 font-semibold text-[#68ba4a]">F</td>
                          <td className="px-2 py-2 font-semibold text-[#68ba4a]">T</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-[#060404]/70 mt-4">
                      Fill in the cells marked with ? to complete the truth table.
                    </p>
                  </div>
                )}

                {id === "logic-matching" && (
                  <div className="space-y-3 w-full max-w-md">
                    <div className="flex gap-2">
                      <div className="flex-1 bg-[#8baab1] text-white p-3 rounded-lg text-sm font-semibold">
                        p ∧ ¬q
                      </div>
                      <div className="flex-1 bg-[#b3ccb8] text-[#060404] p-3 rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#a3bcb8]">
                        ¬(p → q)
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-[#8baab1] text-white p-3 rounded-lg text-sm font-semibold">
                        ¬p ∨ q
                      </div>
                      <div className="flex-1 bg-[#b3ccb8] text-[#060404] p-3 rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#a3bcb8]">
                        p → q
                      </div>
                    </div>
                    <p className="text-xs text-[#060404]/70 mt-4">
                      Drag from left to match with equivalent expressions on the right.
                    </p>
                  </div>
                )}

                {id === "proof-rush" && (
                  <div className="space-y-2 w-full max-w-md text-left text-sm">
                    <p className="font-semibold mb-3">Given premises:</p>
                    <div className="bg-[#f4f7f4] p-2 rounded">1. p → q</div>
                    <div className="bg-[#f4f7f4] p-2 rounded">2. q → r</div>
                    <p className="font-semibold mt-3 mb-2">Goal: Prove p → r</p>
                    <div className="bg-yellow-100 p-2 rounded text-xs">
                      Use available rules: Modus Ponens, Hypothetical Syllogism, etc.
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePlayGame}
                  className="mt-8 px-8 py-3 rounded-xl bg-[#68ba4a] text-white font-semibold hover:bg-[#5a9a3d] transition text-lg shadow-md"
                >
                  🎮 Play Now
                </button>
              </div>
            </div>
          </div>

          {/* Info sidebar */}
          <div className="space-y-4">
            {/* Game info */}
            <div className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-6">
              <h3 className="font-semibold mb-3">📋 Game Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[#060404]/70">Type</p>
                  <p className="font-semibold">{game.type}</p>
                </div>
                <div>
                  <p className="text-[#060404]/70">Max Score</p>
                  <p className="font-semibold">{game.maxScore} points</p>
                </div>
                <div>
                  <p className="text-[#060404]/70">Category</p>
                  <p className="font-semibold">Propositional Logic</p>
                </div>
              </div>
            </div>

            {/* Leaderboard preview */}
            <div className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-6">
              <h3 className="font-semibold mb-3">🏆 Top Scores</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Alex Chen</span>
                  <span className="font-bold text-[#68ba4a]">95</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Jordan Smith</span>
                  <span className="font-bold text-[#8baab1]">87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{studentName}</span>
                  <span className="font-bold text-[#b3ccb8]">—</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#f4f7f4] rounded-2xl p-4">
              <p className="font-semibold text-sm mb-2">💡 Tip</p>
              <p className="text-xs text-[#060404]/70 leading-relaxed">
                {id === "truth-table" &&
                  "Remember: AND is true only when both are true, OR is true when at least one is true."}
                {id === "logic-matching" &&
                  "Look for patterns. The contrapositive is always equivalent to the original statement."}
                {id === "proof-rush" &&
                  "Use transitivity to chain implications together. Work from premises toward the goal."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameInterface;
