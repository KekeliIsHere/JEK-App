// src/App.tsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/AuthPage";
import Dashboard from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/Dashboard";
import LessonsPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/LessonsPage";
import QuizzesPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/QuizzesPage";
import GamesPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/GamesPage";
import LessonDetailPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/LessonDetailPage";
import QuizInterface from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/QuizInterface";
import GameInterface from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/GameInterface";
import AdminPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/AdminPage";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

const App = () => {
  const [studentName, setStudentName] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({});

  // Load persisted stats from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("jek_userStats");
      if (raw) setUserStats(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist stats whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("jek_userStats", JSON.stringify(userStats));
    } catch (e) {
      // ignore
    }
  }, [userStats]);

  const handleLogin = (name: string) => {
    const normalizedName = name || "Student";
    setStudentName(normalizedName);
    
    // Initialize stats for new users on first login
    if (!userStats[normalizedName]) {
      setUserStats({
        ...userStats,
        [normalizedName]: {
          level: 0,
          xp: 0,
          completedLessons: [],
        },
      });
    }
  };

  const handleLogout = () => {
    setStudentName(null);
  };

  const isAuthed = !!studentName;

  return (
    <Routes>
      {/* Login / Sign up */}
      <Route path="/" element={<AuthPage onLogin={handleLogin} />} />

      {/* Protected: Dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuthed ? (
            <Dashboard
              studentName={studentName!}
              onLogout={handleLogout}
              userStats={userStats[studentName!] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName!]: stats })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected: Lessons */}
      <Route
        path="/lessons"
        element={
          isAuthed ? (
            <LessonsPage 
              studentName={studentName!}
              userStats={userStats[studentName!] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats) => setUserStats({ ...userStats, [studentName!]: stats })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected: Lesson Detail */}
      <Route
        path="/lesson/:id"
        element={
          isAuthed ? (
            <LessonDetailPage 
              studentName={studentName!}
              userStats={userStats[studentName!] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats) => setUserStats({ ...userStats, [studentName!]: stats })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected: Quizzes */}
      <Route
        path="/quizzes"
        element={
          isAuthed ? (
            <QuizzesPage
              studentName={studentName!}
              userStats={userStats[studentName!] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName!]: stats })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected: Quiz Interface */}
      <Route
        path="/quiz/:id"
        element={
          isAuthed ? (
            <QuizInterface
              studentName={studentName!}
              userStats={userStats[studentName!] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName!]: stats })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected: Games */}
      <Route
        path="/games"
        element={
          isAuthed ? (
            <GamesPage
              studentName={studentName!}
              userStats={userStats[studentName!] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName!]: stats })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected: Game Interface */}
      <Route
        path="/game/:id"
        element={
          isAuthed ? (
            <GameInterface
              studentName={studentName!}
              userStats={userStats[studentName!] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName!]: stats })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Admin Panel */}
      <Route
        path="/admin"
        element={<AdminPage studentName={studentName || "Admin"} />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
