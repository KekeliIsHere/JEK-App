// src/App.tsx
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/AuthPage";
import Dashboard from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/Dashboard";
import LessonsPage from "c:/Users/agblo/Downloads/JEK-App/frontend/src/pages/LessonsPage";

const App = () => {
  const [studentName, setStudentName] = useState<string | null>(null);

  const handleLogin = (name: string) => {
    setStudentName(name || "Student");
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
            <Dashboard studentName={studentName!} />
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
            <LessonsPage studentName={studentName!} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
