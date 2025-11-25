// src/pages/QuizInterface.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

interface QuizInterfaceProps {
  studentName: string;
  userStats?: UserStats;
  onUpdateStats?: (stats: UserStats) => void;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QuizInterface = ({ studentName, userStats, onUpdateStats }: QuizInterfaceProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [appliedReward, setAppliedReward] = useState(false);

  const defaultQuizzes: Record<string, { title: string; questions: Question[] }> = {
    "logic-basics": {
      title: "Logic Basics Quiz",
      questions: [
        {
          id: "q1",
          text: "Which of the following is a tautology?",
          options: ["p ∧ ¬p", "p ∨ ¬p", "p ∧ q", "p → ¬p"],
          correct: 1,
          explanation:
            "p ∨ ¬p is always true (the law of excluded middle). This is a tautology.",
        },
        {
          id: "q2",
          text: "What is the truth value of (T ∧ F)?",
          options: ["True", "False", "Unknown", "Undefined"],
          correct: 1,
          explanation:
            "A conjunction is only true when both parts are true. Since F is false, the result is false.",
        },
        {
          id: "q3",
          text: "Which statement is logically equivalent to p → q?",
          options: ["q → p", "¬p ∨ q", "p ∨ q", "¬q → ¬p"],
          correct: 1,
          explanation:
            "p → q is logically equivalent to ¬p ∨ q. Also equivalent to ¬q → ¬p (contrapositive).",
        },
        {
          id: "q4",
          text: "What is the negation of (p ∧ q)?",
          options: ["¬p ∧ ¬q", "¬p ∨ ¬q", "p ∨ q", "¬(p ∧ q)"],
          correct: 1,
          explanation:
            "By De Morgan's Law, ¬(p ∧ q) = ¬p ∨ ¬q. The negation of AND is OR with negated parts.",
        },
        {
          id: "q5",
          text: "Is (p → q) the same as (q → p)?",
          options: ["Always", "Never", "Sometimes", "Not comparable"],
          correct: 1,
          explanation:
            "No, they are not equivalent. p → q (if p then q) is not the same as q → p (if q then p). This second is called the converse.",
        },
      ],
    },
    "truth-tables": {
      title: "Truth Tables Quiz",
      questions: [
        {
          id: "q1",
          text: "How many rows does a truth table for 3 variables have?",
          options: ["3", "6", "8", "9"],
          correct: 2,
          explanation:
            "A truth table with n variables has 2^n rows. With 3 variables: 2^3 = 8 rows.",
        },
        {
          id: "q2",
          text: "In a truth table for p ∨ q, when is the result TRUE?",
          options: [
            "Only when both are true",
            "Only when both are false",
            "When at least one is true",
            "Never",
          ],
          correct: 2,
          explanation:
            "Disjunction (OR) is true when at least one of the disjuncts is true. It's false only when both are false.",
        },
        {
          id: "q3",
          text: "What does a contradiction look like in a truth table?",
          options: [
            "All true",
            "All false",
            "Mixed true and false",
            "Unknown values",
          ],
          correct: 1,
          explanation:
            "A contradiction is always false, so all rows in its final column are false.",
        },
        {
          id: "q4",
          text: "Which formula is logically equivalent to ¬(¬p)?",
          options: ["¬p", "p", "True", "False"],
          correct: 1,
          explanation:
            "Double negation eliminates: ¬(¬p) = p. Negating twice returns to the original.",
        },
      ],
    },
  };

  // allow admin-managed quizzes via localStorage
  const stored = typeof window !== "undefined" ? localStorage.getItem("jek_quizzes") : null;
  const quizzes = stored ? JSON.parse(stored) : defaultQuizzes;

  const quiz = (quizzes as Record<string, { title: string; questions: Question[] }>)[id || ""] || (quizzes as any)["logic-basics"];
  const questions = quiz.questions;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (optionIndex: number) => {
    setAnswered(optionIndex);
    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizComplete(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(null);
      setShowResult(false);
    }
  };

  // Apply XP reward once when quiz completes
  useEffect(() => {
    if (quizComplete && !appliedReward && (typeof window !== "undefined")) {
      const percentage = Math.round((score / questions.length) * 100);
      const passed = percentage >= 70;
      const xpEarned = passed ? 75 : 25;
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
  }, [quizComplete, appliedReward]);

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  const question = questions[currentQuestion];
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-[#fbf9f9] text-[#060404] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-[#b3ccb8]/40 p-8 max-w-md w-full text-center">
          <div className="mb-6">
            {passed ? (
              <div className="text-6xl mb-4">🎉</div>
            ) : (
              <div className="text-6xl mb-4">📚</div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>

          <div className="bg-[#f4f7f4] rounded-xl p-6 mb-6">
            <p className="text-sm text-[#060404]/70 mb-2">Your Score</p>
            <p className="text-5xl font-bold text-[#68ba4a] mb-2">
              {score}/{questions.length}
            </p>
            <p className="text-2xl font-semibold text-[#8baab1]">{percentage}%</p>
          </div>

          <p className="text-lg font-semibold mb-6">
            {passed ? (
              <span className="text-[#68ba4a]">✅ You passed! Great work!</span>
            ) : (
              <span className="text-[#8baab1]">Keep practicing!</span>
            )}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full px-6 py-3 rounded-xl bg-[#68ba4a] text-white font-semibold hover:bg-[#5a9a3d] transition"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => navigate("/quizzes")}
              className="w-full px-6 py-3 rounded-xl bg-[#b3ccb8] text-[#060404] font-semibold hover:bg-[#a3bcb8] transition"
            >
              ← Back to Quizzes
            </button>
          </div>

          <p className="text-sm text-[#060404]/70 mt-6">
            {passed ? "+75 XP earned!" : "+25 XP earned"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] text-[#060404]">
      {/* Header */}
      <header className="bg-white border-b border-[#b3ccb8]/40 p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{quiz.title}</h1>
            <p className="text-sm text-[#060404]/70 mt-1">Student: {studentName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#060404]/70">Question</p>
            <p className="text-2xl font-bold text-[#68ba4a]">
              {currentQuestion + 1}/{questions.length}
            </p>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-[#b3ccb8]/40 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="w-full h-2 bg-[#e5f0e5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#68ba4a] transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Question */}
        <section className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-6 md:p-8 mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-8">{question.text}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition font-semibold ${
                  answered === index
                    ? index === question.correct
                      ? "bg-[#68ba4a]/20 border-[#68ba4a] text-[#060404]"
                      : "bg-red-100 border-red-500 text-[#060404]"
                    : index === question.correct && showResult
                    ? "bg-[#68ba4a]/20 border-[#68ba4a] text-[#060404]"
                    : "bg-white border-[#b3ccb8] hover:border-[#8baab1]"
                } ${showResult ? "cursor-default" : "cursor-pointer hover:bg-[#f4f7f4]"}`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-current">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                  {answered === index && showResult && (
                    <span className="ml-auto">
                      {index === question.correct ? "✅" : "❌"}
                    </span>
                  )}
                  {index === question.correct && showResult && answered !== index && (
                    <span className="ml-auto">✓ Correct</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="bg-[#f4f7f4] border-l-4 border-[#68ba4a] rounded-lg p-4 mb-6">
              <p className="font-semibold text-[#68ba4a] mb-2">Explanation:</p>
              <p className="text-sm text-[#060404]/80">{question.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {showResult && (
            <button
              onClick={handleNext}
              className="w-full px-6 py-3 rounded-xl bg-[#68ba4a] text-white font-semibold hover:bg-[#5a9a3d] transition"
            >
              {isLastQuestion ? "🏁 Finish Quiz" : "Next Question →"}
            </button>
          )}
        </section>

        {/* Score tracker */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-[#b3ccb8]/40">
            <p className="text-xs text-[#060404]/70 uppercase tracking-wide">Correct</p>
            <p className="text-2xl font-bold text-[#68ba4a]">{score}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#b3ccb8]/40">
            <p className="text-xs text-[#060404]/70 uppercase tracking-wide">Current</p>
            <p className="text-2xl font-bold text-[#8baab1]">
              {Math.round((score / (currentQuestion + 1)) * 100)}%
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizInterface;
