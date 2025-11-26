import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

interface QuizzesPageProps {
  studentName: string;
  userStats?: UserStats;
  onUpdateStats?: (stats: UserStats) => void;
}

const quizzes = [
  {
    id: "quiz-1",
    title: "Logic Basics",
    description: "Test your knowledge on basic logical operators.",
    questions: 10,
    xp: 80,
    difficulty: "Intro",
  },
  {
    id: "quiz-2",
    title: "Truth Tables",
    description: "Construct and evaluate truth tables.",
    questions: 15,
    xp: 120,
    difficulty: "Core",
  },
  {
    id: "quiz-3",
    title: "Conditionals Mastery",
    description: "Advanced questions on conditionals and variants.",
    questions: 20,
    xp: 150,
    difficulty: "Challenge",
  },
];

export default function QuizzesPage({ studentName, userStats }: QuizzesPageProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const locked = !userStats || (userStats.completedLessons || []).length === 0;

  const handleStartQuiz = (id: string) => {
    if (locked) return;
    navigate(`/quiz/${id}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8faf9] to-[#e8f5e9] flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="quizzes" />

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
            <h1 className="text-2xl md:text-3xl font-bold">Quizzes</h1>
            <p className="text-sm text-[#060404]/70 mt-1">
              Test your knowledge. Each quiz awards XP and builds your score.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#8baab1] text-white flex items-center justify-center font-semibold">
            {studentName[0]?.toUpperCase() ?? "S"}
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-4 flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">{quiz.title}</h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${quiz.difficulty === "Intro"
                      ? "bg-[#b3ccb8]"
                      : quiz.difficulty === "Core"
                        ? "bg-[#8baab1] text-white"
                        : "bg-[#68ba4a] text-white"
                      }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>
                <p className="text-sm text-[#060404]/80">{quiz.description}</p>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-[#f4f7f4]">
                    🎯 {quiz.questions} questions
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[#f4f7f4]">
                    ✨ {quiz.xp} XP
                  </span>
                </div>
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  disabled={locked}
                  className={`w-full px-3 py-2 rounded-full text-white text-sm font-semibold transition ${locked ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#68ba4a] hover:opacity-90"}`}
                >
                  {locked ? "🔒 Locked" : "Start Quiz"}
                </button>
              </div>
            ))}
          </div>
        </main>
      </main>
    </div>
  );
}
