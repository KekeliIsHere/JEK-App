// src/pages/LessonDetailPage.tsx
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface UserStats {
  level: number;
  xp: number;
  completedLessons: string[];
}

interface LessonDetailPageProps {
  studentName: string;
  userStats?: UserStats;
  onUpdateStats?: (stats: UserStats) => void;
}

const LessonDetailPage = ({ studentName, userStats: propsUserStats, onUpdateStats: propsOnUpdateStats }: LessonDetailPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const userStats = (propsUserStats || location.state?.userStats || {
    level: 0,
    xp: 0,
    completedLessons: [],
  }) as UserStats;

  const onUpdateStats = propsOnUpdateStats || location.state?.onUpdateStats;

  const lessonData: Record<
    string,
    {
      title: string;
      description: string;
      level: string;
      objectives: string[];
      content: string;
      examples: { title: string; description: string }[];
    }
  > = {
    "sets-ops": {
      title: "Basic Sets & Operations",
      description: "Learn fundamental set theory and operations",
      level: "Intro",
      objectives: [
        "Understand set notation and membership",
        "Perform union, intersection, and complement operations",
        "Apply De Morgan's Laws",
        "Solve set theory problems",
      ],
      content:
        "Sets are fundamental building blocks in logic. A set is a collection of distinct objects. We denote sets with curly braces {...}.",
      examples: [
        {
          title: "Union",
          description:
            "A ∪ B contains all elements in A or B or both. {1,2} ∪ {2,3} = {1,2,3}",
        },
        {
          title: "Intersection",
          description:
            "A ∩ B contains only elements in both A and B. {1,2} ∩ {2,3} = {2}",
        },
        {
          title: "Complement",
          description: "A' contains all elements NOT in A (relative to universe U)",
        },
      ],
    },
    "props-conn": {
      title: "Propositions & Connectives",
      description: "Master logical connectives and truth tables",
      level: "Core",
      objectives: [
        "Understand propositions and truth values",
        "Apply AND, OR, NOT connectives",
        "Build complex formulas",
        "Evaluate truth conditions",
      ],
      content:
        "A proposition is a statement that is either true or false. Logical connectives combine propositions to form complex statements.",
      examples: [
        {
          title: "Conjunction (AND)",
          description: "p ∧ q is true only when both p and q are true",
        },
        {
          title: "Disjunction (OR)",
          description: "p ∨ q is true when at least one of p or q is true",
        },
        {
          title: "Negation (NOT)",
          description: "¬p flips the truth value of p",
        },
      ],
    },
    "truth-tables": {
      title: "Truth Tables",
      description: "Create and analyze truth tables",
      level: "Core",
      objectives: [
        "Construct truth tables for any formula",
        "Identify tautologies and contradictions",
        "Compare logical equivalence",
        "Simplify complex formulas",
      ],
      content:
        "Truth tables systematically show all possible truth value combinations and the resulting outcome of a formula.",
      examples: [
        {
          title: "Tautology",
          description: "A formula that is always true (p ∨ ¬p)",
        },
        {
          title: "Contradiction",
          description: "A formula that is always false (p ∧ ¬p)",
        },
        {
          title: "Contingency",
          description: "A formula that can be true or false depending on values",
        },
      ],
    },
    "conditionals": {
      title: "Conditionals & Variants",
      description: "Understand if-then statements and related concepts",
      level: "Challenge",
      objectives: [
        "Master material conditional (→)",
        "Understand converse, inverse, contrapositive",
        "Recognize logical equivalences",
        "Solve complex conditional problems",
      ],
      content:
        'The conditional p → q ("if p then q") is false only when p is true and q is false.',
      examples: [
        {
          title: "Converse",
          description: "Original: p → q, Converse: q → p (NOT logically equivalent)",
        },
        {
          title: "Inverse",
          description:
            "Original: p → q, Inverse: ¬p → ¬q (NOT logically equivalent)",
        },
        {
          title: "Contrapositive",
          description:
            "Original: p → q, Contrapositive: ¬q → ¬p (LOGICALLY EQUIVALENT)",
        },
      ],
    },
  };

  const lesson = lessonData[id || ""] || lessonData["sets-ops"];

  const handleCompleteLesson = () => {
    const xpReward = 50;
    if (userStats && onUpdateStats) {
      const updated = {
        ...userStats,
        xp: userStats.xp + xpReward,
        level: Math.floor((userStats.xp + xpReward) / 100),
        completedLessons: userStats.completedLessons.includes(id || "")
          ? userStats.completedLessons
          : [...userStats.completedLessons, id || ""],
      };
      onUpdateStats(updated);
      alert(`✅ Lesson "${lesson.title}" completed! +${xpReward} XP earned`);
    } else {
      alert(`✅ Lesson "${lesson.title}" completed! +${xpReward} XP earned`);
    }
    navigate("/lessons");
  };

  const handleTakeLessonQuiz = () => {
    alert("🎯 Quiz for this lesson coming soon!");
    // Future: navigate(`/quiz/lesson-${id}`);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f9] text-[#060404]">
      {/* Header */}
      <header className="bg-white border-b border-[#b3ccb8]/40 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/lessons")}
            className="text-[#68ba4a] hover:text-[#5a9a3d] font-semibold text-sm mb-3 flex items-center gap-1"
          >
            ← Back to Lessons
          </button>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-[#060404]/70 mb-4">{lesson.description}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-[#b3ccb8]/30 text-sm font-semibold">
                  📚 {lesson.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#68ba4a]/20 text-sm">
                  +50 XP
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#060404]/70">Student</p>
              <p className="font-semibold">{studentName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Learning objectives */}
        <section className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📍 Learning Objectives</h2>
          <ul className="space-y-2">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#68ba4a] font-bold mt-1">✓</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Lesson content */}
        <section className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📖 Lesson Content</h2>
          <p className="text-[#060404]/80 leading-relaxed mb-6">{lesson.content}</p>

          {/* Examples */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Examples:</h3>
            {lesson.examples.map((example, i) => (
              <div key={i} className="bg-[#f4f7f4] rounded-xl p-4 border-l-4 border-[#68ba4a]">
                <p className="font-semibold text-[#68ba4a] mb-1">{example.title}</p>
                <p className="text-sm text-[#060404]/80">{example.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practice section */}
        <section className="bg-white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🎯 Practice Time</h2>
          <p className="text-[#060404]/70 mb-4">
            Now that you've learned the concepts, try these practice problems to reinforce your understanding.
          </p>
          <div className="bg-[#f4f7f4] rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="font-bold text-[#68ba4a]">1.</span>
              <div>
                <p className="font-semibold">Practice Exercise</p>
                <p className="text-sm text-[#060404]/70">Solve 5 problems related to this lesson</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-[#68ba4a]">2.</span>
              <div>
                <p className="font-semibold">Knowledge Check</p>
                <p className="text-sm text-[#060404]/70">Quick quiz with 3-5 questions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={handleCompleteLesson}
            className="flex-1 px-6 py-3 rounded-xl bg-[#68ba4a] text-white font-semibold hover:bg-[#5a9a3d] transition shadow-md"
          >
            ✅ Mark as Complete
          </button>
          <button
            onClick={handleTakeLessonQuiz}
            className="flex-1 px-6 py-3 rounded-xl bg-[#8baab1] text-white font-semibold hover:bg-[#7a9aa1] transition shadow-md"
          >
            🎯 Take Lesson Quiz
          </button>
        </div>
      </main>
    </div>
  );
};

export default LessonDetailPage;
