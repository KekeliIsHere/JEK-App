// src/App.tsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import AuthPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/AuthPage";
// import Dashboard from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/Dashboard";
// import LessonsPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/LessonsPage";
// import QuizzesPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/QuizzesPage";
// import GamesPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/GamesPage";
// import LessonDetailPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/LessonDetailPage";
// import QuizInterface from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/QuizInterface";
// import GameInterface from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/GameInterface";
// import AdminPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/AdminPage";

import AuthPage from "../src/pages/AuthPage";
import Dashboard from "../src/pages/Dashboard";
import LessonsPage from "../src/pages/LessonsPage";
import QuizzesPage from "../src/pages/QuizzesPage";
import GamesPage from "../src/pages/GamesPage";
import LessonDetailPage from "../src/pages/LessonDetailPage";
import QuizInterface from "../src/pages/QuizInterface";
import GameInterface from "../src/pages/GameInterface";
import AdminPage from "../src/pages/AdminPage";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

const App = () => {
  const { user, loading } = useAuth();
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({});

  // Get student name from authenticated user
  const studentName = user ? `${user.firstname || user.email.split('@')[0]}` : null;

  // Load persisted stats from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("jek_userStats");
      if (raw) setUserStats(JSON.parse(raw));
    } catch (e) {
      // ignore
      console.log(e)
    }
  }, []);

  // Persist stats whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("jek_userStats", JSON.stringify(userStats));
    } catch (e) {
      // ignore
      console.log(e)
    }
  }, [userStats]);

  const isAuthed = !!user;

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login / Sign up */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth-page" element={<AuthPage />} />

      {/* Protected: Dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuthed && studentName ? (
            <Dashboard
              studentName={studentName}
              onLogout={() => { }} // Logout is handled by AuthContext
              userStats={userStats[studentName] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName]: stats })}
            />
          ) : (
            <Navigate to="/auth-page" replace />
          )
        }
      />

      {/* Protected: Lessons */}
      <Route
        path="/lessons"
        element={
          isAuthed && studentName ? (
            <LessonsPage
              studentName={studentName}
              userStats={userStats[studentName] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats) => setUserStats({ ...userStats, [studentName]: stats })}
            />
          ) : (
            <Navigate to="/auth-page" replace />
          )
        }
      />

      {/* Protected: Lesson Detail */}
      <Route
        path="/lesson/:id"
        element={
          isAuthed && studentName ? (
            <LessonDetailPage
              studentName={studentName}
              userStats={userStats[studentName] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats) => setUserStats({ ...userStats, [studentName]: stats })}
            />
          ) : (
            <Navigate to="/auth-page" replace />
          )
        }
      />

      {/* Protected: Quizzes */}
      <Route
        path="/quizzes"
        element={
          isAuthed && studentName ? (
            <QuizzesPage
              studentName={studentName}
              userStats={userStats[studentName] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName]: stats })}
            />
          ) : (
            <Navigate to="/auth-page" replace />
          )
        }
      />

      {/* Protected: Quiz Interface */}
      <Route
        path="/quiz/:id"
        element={
          isAuthed && studentName ? (
            <QuizInterface
              studentName={studentName}
              userStats={userStats[studentName] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName]: stats })}
            />
          ) : (
            <Navigate to="/auth-page" replace />
          )
        }
      />

      {/* Protected: Games */}
      <Route
        path="/games"
        element={
          isAuthed && studentName ? (
            <GamesPage
              studentName={studentName}
              userStats={userStats[studentName] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName]: stats })}
            />
          ) : (
            <Navigate to="/auth-page" replace />
          )
        }
      />

      {/* Protected: Game Interface */}
      <Route
        path="/game/:id"
        element={
          isAuthed && studentName ? (
            <GameInterface
              studentName={studentName}
              userStats={userStats[studentName] || { level: 0, xp: 0, completedLessons: [] }}
              onUpdateStats={(stats: UserStats) => setUserStats({ ...userStats, [studentName]: stats })}
            />
          ) : (
            <Navigate to="/auth-page" replace />
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
