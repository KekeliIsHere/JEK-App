// src/pages/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import { IconDashboard, IconLessons, IconQuizzes, IconGames, IconAdmin, IconLogout, IconNotification, IconCheck } from "../components/Icons";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

interface DashboardProps {
  studentName: string;
  onLogout: () => void;
  userStats: UserStats;
  onUpdateStats: (stats: UserStats) => void;
}

const modules = [
  { id: "sets", title: "Basic Sets & Operations", progress: 80, badge: "Core" },
  { id: "props", title: "Propositions & Connectives", progress: 60, badge: "Core" },
  { id: "truth-tables", title: "Truth Tables", progress: 30, badge: "Core" },
  { id: "conditionals", title: "Conditionals & Variants", progress: 0, badge: "Upcoming" },
];

const Dashboard = ({ studentName, onLogout, userStats }: DashboardProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#b3ccb8] text-[#060404] p-4 space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#8baab1] flex items-center justify-center text-white font-bold text-xl">
            ∴
          </div>
          <div>
            <p className="font-bold text-lg">LogicTutor</p>
            <p className="text-xs opacity-80">Propositional Logic</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-full bg-[#fbf9f9] shadow-sm text-sm font-semibold">
            <IconDashboard />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate("/lessons")}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-white/70 text-sm"
          >
            <IconLessons />
            <span>Lessons</span>
          </button>

          <button
            onClick={() => navigate("/quizzes")}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-white/70 text-sm"
          >
            <IconQuizzes />
            <span>Quizzes</span>
          </button>
          <button
            onClick={() => navigate("/games")}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-white/70 text-sm"
          >
            <IconGames />
            <span>Games</span>
          </button>
        </nav>

        <div className="bg-white/70 rounded-xl p-3 text-xs">
          <p className="uppercase tracking-wide text-[10px] opacity-80">
            Today&apos;s goal
          </p>
          <p className="font-semibold">Finish 1 lesson &amp; 1 quiz 💡</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-4 md:p-8 text-[#060404]">
        {/* Top bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {studentName}
            </h1>
            <p className="text-sm text-[#060404]/70 mt-1">
              Continue your journey in logical reasoning and build proof skills.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search lessons or concepts..."
                className="px-3 py-2 rounded-full border border-[#b3ccb8] text-sm focus:outline-none focus:ring-2 focus:ring-[#68ba4a] bg-white"
              />
            </div>
            <button className="w-9 h-9 rounded-full bg-[#b3ccb8] flex items-center justify-center text-[#060404] hover:bg-[#a3bcb8] transition">
              <IconNotification />
            </button>
            <div className="flex items-center justify-center flex-col w-12 h-12 rounded-full border border-[#8baab1] text-xs">
              <span>Level</span>
              <span className="font-bold text-lg">{userStats.level}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#8baab1] text-white flex items-center justify-center font-semibold">
              {studentName[0]?.toUpperCase() ?? "S"}
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-2 text-sm font-semibold rounded-full bg-[#8baab1] text-white hover:bg-[#7a9aa1] transition flex items-center gap-1"
              title="Admin Panel"
            >
              <IconAdmin />
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                navigate("/");
              }}
              className="px-3 py-2 text-sm font-semibold rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition flex items-center gap-1"
            >
              <IconLogout />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* XP card */}
        <section className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div>
              <h2 className="font-semibold text-lg">XP Progress</h2>
              <p className="text-xs md:text-sm text-[#060404]/70">
                {userStats.xp} / {(userStats.level + 1) * 100} XP · Level {userStats.level}
              </p>
            </div>
            <span className="text-xs md:text-sm bg-[#b3ccb8]/70 px-3 py-1 rounded-full">
              {userStats.xp > 0 ? `+${userStats.xp} XP` : "Start learning!"}
            </span>
          </div>
          <div className="w-full h-3 bg-[#e5f0e5] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#68ba4a] via-[#8baab1] to-[#68ba4a]"
              style={{ width: `${(userStats.xp % 100) / 1}%` }}
            />
          </div>
        </section>

        {/* Path + quick actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Learning path */}
          <div className="lg:col-span-2 bg:white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg">My Logic Path</h2>
              <span className="text-xs bg-[#8baab1] text-white px-3 py-1 rounded-full">
                Propositional Logic
              </span>
            </div>

            <div className="space-y-3 mt-2">
              {modules.map((m, i) => (
                <div key={m.id} className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border ${
                        m.progress === 100
                          ? "bg-[#68ba4a] border-[#68ba4a] text-white"
                          : m.progress > 0
                          ? "bg-[#8baab1]/10 border-[#8baab1]"
                          : "bg-white border-[#b3ccb8]"
                      }`}
                    >
                      {m.progress === 100 ? <IconCheck /> : i + 1}
                    </div>
                    {i !== modules.length - 1 && (
                      <div className="flex-1 w-[2px] bg-[#d1dfd1] mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{m.title}</p>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-[#f1f5f1]">
                        {m.badge}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#eef3ee] rounded-full mt-1">
                      <div
                        className="h-full bg-[#68ba4a] rounded-full"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#060404]/60 mt-1">
                      {m.progress}% complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg:white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-4 flex flex-col space-y-3">
            <h2 className="font-semibold text-lg">Quick Actions</h2>
            <button
              onClick={() => navigate("/lessons")}
              className="w-full text-left px-3 py-2 rounded-xl bg-[#f4f7f4] hover:bg-[#e8f1e8] text-sm transition"
            >
              <span className="font-semibold">Browse Lessons</span>
              <span className="block text-[11px] text-[#060404]/70 mt-1">
                Start learning from the beginning
              </span>
            </button>
            <button
              onClick={() => navigate("/quizzes")}
              disabled={userStats.completedLessons.length === 0}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${
                userStats.completedLessons.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-[#f4f7f4] hover:bg-[#e8f1e8]"
              }`}
            >
              <span className="font-semibold">
                {userStats.completedLessons.length === 0 ? "Quizzes Locked" : "Practice Quizzes"}
              </span>
              <span className="block text-[11px] text-[#060404]/70 mt-1">
                {userStats.completedLessons.length === 0 ? "Complete a lesson first" : "Test your knowledge"}
              </span>
            </button>
            <button
              onClick={() => navigate("/games")}
              disabled={userStats.completedLessons.length === 0}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${
                userStats.completedLessons.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-[#f4f7f4] hover:bg-[#e8f1e8]"
              }`}
            >
              <span className="font-semibold">
                {userStats.completedLessons.length === 0 ? "Games Locked" : "Play Logic Games"}
              </span>
              <span className="block text-[11px] text-[#060404]/70 mt-1">
                {userStats.completedLessons.length === 0 ? "Complete a lesson first" : "Learn through challenges"}
              </span>
            </button>
          </div>
        </section>

        {/* Bottom */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg:white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-4">
            <h2 className="font-semibold text-lg mb-2">Reasoning Feedback</h2>
            <div className="space-y-2 text-sm">
              <div className="bg:#f4f7f4 rounded-xl p-3">
                <p className="font-semibold">Misreading conditionals</p>
                <p className="text-xs text-[#060404]/70 mt-1">
                  &quot;If p then q&quot; is only false when p is true and q is false.
                </p>
              </div>
              <div className="bg:#f4f7f4 rounded-xl p-3">
                <p className="font-semibold">Converse vs contrapositive</p>
                <p className="text-xs text-[#060404]/70 mt-1">
                  Rewrite statements with ¬ and → to see the structure clearly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg:white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-4">
            <h2 className="font-semibold text-lg mb-2">Upcoming Activities</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between bg:#f4f7f4 rounded-xl p-3">
                <div>
                  <p className="font-semibold">Quiz: Logical Equivalence</p>
                  <p className="text-xs text-[#060404]/70">
                    Opens Monday · 20 mins · 50 XP
                  </p>
                </div>
                <button className="text-xs px-3 py-1 rounded-full border border-[#8baab1]">
                  Preview
                </button>
              </li>
              <li className="flex items-center justify-between bg:#f4f7f4 rounded-xl p-3">
                <div>
                  <p className="font-semibold">Homework: Truth Tables</p>
                  <p className="text-xs text-[#060404]/70">
                    Due Friday · 5 problems
                  </p>
                </div>
                <button className="text-xs px-3 py-1 rounded-full border border-[#8baab1]">
                  View
                </button>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
