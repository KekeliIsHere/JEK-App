// src/pages/LessonsPage.tsx
import { useNavigate } from "react-router-dom";

interface LessonsPageProps {
  studentName: string;
}

const topics = [
  {
    id: "sets-basic",
    title: "Basic Set Concepts",
    level: "Intro",
    estMinutes: 15,
    description: "Sets, elements, subset, empty set, and simple Venn diagrams.",
    tags: ["sets", "notation"],
  },
  {
    id: "sets-ops",
    title: "Set Operations",
    level: "Core",
    estMinutes: 20,
    description: "Union, intersection, complement, difference, De Morgan’s laws.",
    tags: ["sets", "operations"],
  },
  {
    id: "props",
    title: "Propositions & Truth Values",
    level: "Intro",
    estMinutes: 10,
    description: "What a proposition is and how we assign T or F.",
    tags: ["propositions"],
  },
  {
    id: "connectives",
    title: "Logical Connectives",
    level: "Core",
    estMinutes: 25,
    description: "¬, ∧, ∨, ⊕, →, ↔ and building compound statements.",
    tags: ["connectives"],
  },
  {
    id: "truth-tables",
    title: "Truth Tables",
    level: "Core",
    estMinutes: 25,
    description: "Constructing truth tables and checking equivalence.",
    tags: ["truth tables"],
  },
  {
    id: "conditionals",
    title: "Conditionals & Variants",
    level: "Core",
    estMinutes: 20,
    description: "If–then, converse, inverse, contrapositive, and common mistakes.",
    tags: ["conditionals"],
  },
  {
    id: "equivalence",
    title: "Logical Equivalence",
    level: "Challenge",
    estMinutes: 25,
    description: "Using laws to rewrite statements and prove equivalence.",
    tags: ["equivalence"],
  },
  {
    id: "inference",
    title: "Rules of Inference",
    level: "Challenge",
    estMinutes: 30,
    description: "Modus ponens, modus tollens, and valid vs invalid arguments.",
    tags: ["inference"],
  },
];

const LessonsPage = ({ studentName }: LessonsPageProps) => {
  const navigate = useNavigate();

  const handleStartLesson = (id: string) => {
    console.log("Start lesson:", id);
    alert(`Starting lesson: ${id}`);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f9] text-[#060404] p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-[#8baab1] hover:underline mb-1"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Lessons</h1>
          <p className="text-sm text-[#060404]/70 mt-1">
            Hi {studentName}, pick a topic to learn. Each lesson ends with a quiz
            and a small game.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search topics..."
            className="px-3 py-2 rounded-full border border-[#b3ccb8] text-sm focus:outline-none focus:ring-2 focus:ring-[#68ba4a] bg-white"
          />
          <div className="hidden md:flex items-center justify-center flex-col w-12 h-12 rounded-full border border-[#8baab1] text-xs">
            <span>Level</span>
            <span className="font-bold text-lg">2</span>
          </div>
        </div>
      </header>

      {/* Cards */}
      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <article
              key={topic.id}
              className="bg:white rounded-2xl shadow-md border border-[#b3ccb8]/40 p-4 flex flex-col space-y-2"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{topic.title}</h2>
                <span
                  className={`text-[11px] px-2 py-1 rounded-full ${
                    topic.level === "Intro"
                      ? "bg-[#b3ccb8]"
                      : topic.level === "Core"
                      ? "bg-[#8baab1] text:white"
                      : "bg-[#68ba4a] text:white"
                  }`}
                >
                  {topic.level}
                </span>
              </div>

              <p className="text-sm text-[#060404]/80">{topic.description}</p>

              <div className="flex items-center space-x-2 text-xs mt-1">
                <span className="px-2 py-1 rounded-full bg:#f4f7f4">
                  ⏱ {topic.estMinutes} min
                </span>
                <span className="px-2 py-1 rounded-full bg:#f4f7f4">
                  🎖 100 XP
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mt-1 text-[11px]">
                {topic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full bg:#eef3ee"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleStartLesson(topic.id)}
                  className="flex-1 px-3 py-2 rounded-full bg-[#68ba4a] text-white text-sm font-semibold hover:opacity-90"
                >
                  Start Lesson
                </button>
                <button className="flex-1 px-3 py-2 rounded-full border border-[#8baab1] text-sm hover:bg-[#8baab1]/10">
                  Practice Only
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;
