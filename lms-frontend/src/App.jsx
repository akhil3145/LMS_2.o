import { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";

const dummyBootcamps = [
  {
    id: 1,
    title: "React and JavaScript Mastery",
    url: "",
    totalLessons: 6,
    color: "#4f7cff",
    icon: "⚛️",
    modules: [
      {
        title: "Module 1 Foundations",
        lessons: [
          { title: "JavaScript Crash Course", videoId: "hdI2bqOjy3c", startSeconds: 0, endSeconds: null },
          { title: "Modern JavaScript Features", videoId: "NCwa_xi0Uuc", startSeconds: 0, endSeconds: null },
          { title: "Array Methods", videoId: "R8rmfD9Y5-c", startSeconds: 0, endSeconds: null },
        ],
      },
      {
        title: "Module 2 React Basics",
        lessons: [
          { title: "React Intro", videoId: "Ke90Tje7VS0", startSeconds: 0, endSeconds: null },
          { title: "React Components", videoId: "SqcY0GlETPk", startSeconds: 0, endSeconds: null },
          { title: "React State", videoId: "O6P86uwfdR0", startSeconds: 0, endSeconds: null },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Python for Beginners",
    url: "",
    totalLessons: 6,
    color: "#21c55d",
    icon: "🐍",
    modules: [
      {
        title: "Module 1 Python Foundations",
        lessons: [
          { title: "Python for Beginners", videoId: "kqtD5dpn9C8", startSeconds: 0, endSeconds: null },
          { title: "Python Full Course", videoId: "rfscVS0vtbw", startSeconds: 0, endSeconds: null },
          { title: "Python Variables", videoId: "_uQrJ0TkZlc", startSeconds: 0, endSeconds: null },
        ],
      },
      {
        title: "Module 2 Python Practice",
        lessons: [
          { title: "Python Functions", videoId: "9Os0o3wzS_I", startSeconds: 0, endSeconds: null },
          { title: "Python Lists", videoId: "ohCDWZgNIU0", startSeconds: 0, endSeconds: null },
          { title: "Python Projects", videoId: "8ext9G7xspg", startSeconds: 0, endSeconds: null },
        ],
      },
    ],
  },
];

const styles = {
  courseLayout: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    background: "var(--bg)",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "34px",
  },
};

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [bootcamps, setBootcamps] = useState(dummyBootcamps);
  const [activeBootcamp, setActiveBootcamp] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  function handleLogin(username) {
    setUser(username);
    setPage("dashboard");
  }

  function handleOpenCourse(bootcamp) {
    setActiveBootcamp(bootcamp);
    setSelectedLesson(bootcamp.modules[0].lessons[0]);
    setCompletedLessons(new Set());
    setPage("course");
  }

  function handleBack() {
    setPage("dashboard");
    setActiveBootcamp(null);
    setSelectedLesson(null);
  }

  function handleLogout() {
    setUser(null);
    setPage("login");
  }

  function handleLessonSelect(lesson) {
    setSelectedLesson(lesson);
  }

  function handleMarkComplete() {
    const lessons = activeBootcamp.modules.flatMap((module) => module.lessons);
    const currentIndex = lessons.findIndex((lesson) => lesson === selectedLesson);

    setCompletedLessons((currentCompletedLessons) => {
      const nextCompletedLessons = new Set(currentCompletedLessons);
      nextCompletedLessons.add(selectedLesson.title);
      return nextCompletedLessons;
    });

    if (lessons[currentIndex + 1]) {
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  }

  if (page === "login") {
    return <Login onLogin={handleLogin} />;
  }

  if (page === "dashboard") {
    return (
      <Dashboard
        user={user}
        bootcamps={bootcamps}
        setBootcamps={setBootcamps}
        onOpenCourse={handleOpenCourse}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div style={styles.courseLayout}>
      <Sidebar
        bootcamp={activeBootcamp}
        selectedLesson={selectedLesson}
        onLessonSelect={handleLessonSelect}
        onBack={handleBack}
        completedLessons={completedLessons}
      />
      <main style={styles.main}>
        <VideoPlayer selectedLesson={selectedLesson} onMarkComplete={handleMarkComplete} />
      </main>
    </div>
  );
}

export default App;
