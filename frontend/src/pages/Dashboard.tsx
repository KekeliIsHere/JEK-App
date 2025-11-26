import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  order_index: number;
  is_active: boolean;
}

interface DashboardProps {
  studentName: string;
  onLogout: () => void;
  userStats: UserStats;
  onUpdateStats: (stats: UserStats) => void;
}

const Dashboard = ({ studentName, userStats }: DashboardProps) => {
  const navigate = useNavigate();
  const { fetchLessons, logout } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadLessons() {
      try {
        const fetchedLessons = await fetchLessons();
        setLessons(fetchedLessons);
      } catch (error) {
        console.error("Failed to load lessons:", error);
      } finally {
        setLoadingLessons(false);
      }
    }
    loadLessons();
  }, [fetchLessons]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8faf9] to-[#e8f5e9] flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="dashboard" />

      {/* Main content */}
      <main className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 md:ml-64 bg-transparent">
        {/* Top bar */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Button - Mobile Only */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-xl bg-white shadow-md text-[#060404] hover:bg-[#68ba4a] hover:text-white transition-all"
                aria-label="Toggle Menu"
              >
                <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#060404] flex items-center gap-2">
                  <i className="fas fa-wave-square text-[#68ba4a] hidden sm:inline"></i>
                  Welcome, {studentName}
                </h1>
                <p className="text-xs sm:text-sm text-[#060404]/60 mt-1">
                  Master logical reasoning, one step at a time
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-[#8baab1] hover:bg-[#68ba4a] hover:text-white transition-all">
              <i className="fas fa-bell"></i>
            </button>
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-md px-3 py-2">
              <i className="fas fa-layer-group text-[#8baab1]"></i>
              <div className="text-xs">
                <span className="text-[#060404]/60">Level</span>
                <span className="font-bold text-[#68ba4a] ml-1">{userStats.level}</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#68ba4a] to-[#8baab1] text-white flex items-center justify-center font-bold shadow-md">
              {studentName[0]?.toUpperCase() ?? "S"}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* XP Progress Card */}
        <section className="bg-white rounded-2xl shadow-lg border border-[#e8f5e9] p-4 sm:p-6 mb-6 hover:shadow-xl transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#68ba4a] to-[#8baab1] flex items-center justify-center shadow-md">
                <i className="fas fa-chart-line text-white text-lg"></i>
              </div>
              <div>
                <h2 className="font-bold text-lg text-[#060404]">XP Progress</h2>
                <p className="text-xs sm:text-sm text-[#060404]/60">
                  {userStats.xp} / {(userStats.level + 1) * 100} XP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm bg-linear-to-r from-[#68ba4a]/20 to-[#8baab1]/20 text-[#68ba4a] font-semibold px-4 py-2 rounded-full border border-[#68ba4a]/30">
                {userStats.xp > 0 ? `+${userStats.xp} XP` : "Start learning!"}
              </span>
            </div>
          </div>
          <div className="w-full h-4 bg-[#e8f5e9] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-linear-to-r from-[#68ba4a] via-[#7cc55f] to-[#68ba4a] rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${Math.min((userStats.xp % 100), 100)}%` }}
            />
          </div>
          <p className="text-xs text-[#060404]/50 mt-2 text-right">
            {Math.min((userStats.xp % 100), 100)}% to Level {userStats.level + 1}
          </p>
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Lessons Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-[#e8f5e9] p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#8baab1] to-[#68ba4a] flex items-center justify-center shadow-md">
                  <i className="fas fa-graduation-cap text-white"></i>
                </div>
                <h2 className="font-bold text-lg sm:text-xl text-[#060404]">Available Lessons</h2>
              </div>
              <span className="text-xs sm:text-sm bg-[#68ba4a] text-white px-3 py-1.5 rounded-full font-semibold shadow-sm">
                {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
              </span>
            </div>

            {loadingLessons ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <i className="fas fa-spinner fa-spin text-3xl text-[#8baab1]"></i>
                  <p className="text-sm text-[#060404]/60">Loading lessons...</p>
                </div>
              </div>
            ) : lessons.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <i className="fas fa-inbox text-4xl text-[#8baab1]/50"></i>
                  <p className="text-sm text-[#060404]/60">No lessons available yet.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="group flex items-start gap-4 bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] rounded-xl p-4 hover:from-[#e8f5e9] hover:to-[#d8ebe9] border border-[#e8f5e9] hover:border-[#68ba4a]/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                  >
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold bg-linear-to-br from-[#68ba4a]/20 to-[#8baab1]/20 border-2 border-[#68ba4a] text-[#68ba4a] shadow-sm group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#060404] group-hover:text-[#68ba4a] transition-colors">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${lesson.is_active
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}>
                            {lesson.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#060404]/60 line-clamp-2 mb-2">
                        {lesson.content.substring(0, 120)}{lesson.content.length > 120 ? '...' : ''}
                      </p>
                      <div className="flex items-center gap-2 text-[#8baab1]">
                        <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                        <span className="text-xs font-medium">Start Learning</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e8f5e9] p-4 sm:p-6 flex flex-col hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#68ba4a] to-[#8baab1] flex items-center justify-center shadow-md">
                <i className="fas fa-bolt text-white"></i>
              </div>
              <h2 className="font-bold text-lg text-[#060404]">Quick Actions</h2>
            </div>
            <div className="space-y-3 flex-1">
              <button
                onClick={() => navigate("/lessons")}
                className="group w-full text-left px-4 py-4 rounded-xl bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] hover:from-[#68ba4a] hover:to-[#7cc55f] border border-[#e8f5e9] hover:border-[#68ba4a] text-sm transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-book-open text-[#8baab1] group-hover:text-white text-lg transition-colors"></i>
                  <span className="font-bold text-[#060404] group-hover:text-white transition-colors">Browse Lessons</span>
                </div>
                <span className="block text-[11px] text-[#060404]/60 group-hover:text-white/90 transition-colors">
                  Explore all available lessons
                </span>
              </button>
              <button
                onClick={() => navigate("/quizzes")}
                className="group w-full text-left px-4 py-4 rounded-xl bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] hover:from-[#8baab1] hover:to-[#9ab8a8] border border-[#e8f5e9] hover:border-[#8baab1] text-sm transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-clipboard-check text-[#8baab1] group-hover:text-white text-lg transition-colors"></i>
                  <span className="font-bold text-[#060404] group-hover:text-white transition-colors">Practice Quizzes</span>
                </div>
                <span className="block text-[11px] text-[#060404]/60 group-hover:text-white/90 transition-colors">
                  Test your knowledge
                </span>
              </button>
              <button
                onClick={() => navigate("/games")}
                className="group w-full text-left px-4 py-4 rounded-xl bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] hover:from-[#68ba4a] hover:to-[#7cc55f] border border-[#e8f5e9] hover:border-[#68ba4a] text-sm transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-gamepad text-[#8baab1] group-hover:text-white text-lg transition-colors"></i>
                  <span className="font-bold text-[#060404] group-hover:text-white transition-colors">Logic Games</span>
                </div>
                <span className="block text-[11px] text-[#060404]/60 group-hover:text-white/90 transition-colors">
                  Learn through challenges
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Progress Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e8f5e9] p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#8baab1] to-[#68ba4a] flex items-center justify-center shadow-md">
                <i className="fas fa-chart-bar text-white"></i>
              </div>
              <h2 className="font-bold text-lg text-[#060404]">Your Progress</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] rounded-xl p-4 border border-[#e8f5e9] hover:border-[#68ba4a]/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#68ba4a]/20 to-[#8baab1]/20 flex items-center justify-center">
                    <i className="fas fa-layer-group text-[#8baab1]"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#060404]">Current Level</p>
                    <p className="text-xs text-[#060404]/60 mt-0.5">
                      Keep learning to level up!
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#68ba4a]">
                  {userStats.level}
                </div>
              </div>
              <div className="flex items-center justify-between bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] rounded-xl p-4 border border-[#e8f5e9] hover:border-[#68ba4a]/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#68ba4a]/20 to-[#8baab1]/20 flex items-center justify-center">
                    <i className="fas fa-star text-[#68ba4a]"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#060404]">Total XP</p>
                    <p className="text-xs text-[#060404]/60 mt-0.5">
                      Experience points earned
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#8baab1]">
                  {userStats.xp}
                </div>
              </div>
              <div className="flex items-center justify-between bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] rounded-xl p-4 border border-[#e8f5e9] hover:border-[#68ba4a]/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#68ba4a]/20 to-[#8baab1]/20 flex items-center justify-center">
                    <i className="fas fa-check-double text-[#68ba4a]"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#060404]">Completed</p>
                    <p className="text-xs text-[#060404]/60 mt-0.5">
                      Lessons finished
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#8baab1]">
                  {userStats.completedLessons.length}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Tips */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e8f5e9] p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#68ba4a] to-[#8baab1] flex items-center justify-center shadow-md">
                <i className="fas fa-lightbulb text-white"></i>
              </div>
              <h2 className="font-bold text-lg text-[#060404]">Learning Tips</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] rounded-xl p-4 border border-[#e8f5e9] hover:border-[#8baab1]/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8baab1]/20 flex items-center justify-center shrink-0">
                    <i className="fas fa-clock text-[#8baab1]"></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#060404] mb-1">Take Your Time</p>
                    <p className="text-xs text-[#060404]/60">
                      Don't rush through lessons. Understanding is key!
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] rounded-xl p-4 border border-[#e8f5e9] hover:border-[#68ba4a]/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#68ba4a]/20 flex items-center justify-center shrink-0">
                    <i className="fas fa-redo text-[#68ba4a]"></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#060404] mb-1">Practice Regularly</p>
                    <p className="text-xs text-[#060404]/60">
                      Complete quizzes to reinforce your learning.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-linear-to-r from-[#f8faf9] to-[#f0f7f1] rounded-xl p-4 border border-[#e8f5e9] hover:border-[#8baab1]/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8baab1]/20 flex items-center justify-center shrink-0">
                    <i className="fas fa-trophy text-[#8baab1]"></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#060404] mb-1">Challenge Yourself</p>
                    <p className="text-xs text-[#060404]/60">
                      Try the logic games for a fun way to learn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
