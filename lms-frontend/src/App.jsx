import { useEffect, useState } from "react";
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
    icon: "JS",
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
    icon: "PY",
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
    animation: "fadeUp 220ms ease both",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "40px",
    background:
      "radial-gradient(circle at top right, rgba(79, 124, 255, 0.12), transparent 34%), var(--bg)",
  },
};

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [bootcamps, setBootcamps] = useState(dummyBootcamps);
  const [activeBootcamp, setActiveBootcamp] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("lf_user");
    const savedBootcamps = localStorage.getItem("lf_bootcamps");
    const savedCompleted = localStorage.getItem("lf_completed");

    if (savedUser) {
      setUser(savedUser);
      setPage("dashboard");
    } else {
      setUser(null);
      setPage("login");
    }

    if (savedBootcamps) {
      try {
        const parsedBootcamps = JSON.parse(savedBootcamps);
        setBootcamps(Array.isArray(parsedBootcamps) ? parsedBootcamps : dummyBootcamps);
      } catch {
        setBootcamps(dummyBootcamps);
      }
    }

    if (savedCompleted) {
      try {
        const parsedCompleted = JSON.parse(savedCompleted);
        setCompletedLessons(new Set(Array.isArray(parsedCompleted) ? parsedCompleted : []));
      } catch {
        setCompletedLessons(new Set());
      }
    }

    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage || user === null) {
      return;
    }

    localStorage.setItem("lf_user", user);
  }, [hasLoadedStorage, user]);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    localStorage.setItem("lf_bootcamps", JSON.stringify(bootcamps));
  }, [bootcamps, hasLoadedStorage]);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    localStorage.setItem("lf_completed", JSON.stringify(Array.from(completedLessons)));
  }, [completedLessons, hasLoadedStorage]);

  function handleLogin(username) {
    setUser(username);
    setPage("dashboard");
  }

  function handleOpenCourse(bootcamp) {
    if (!bootcamp.modules?.[0]?.lessons?.[0]) {
      return;
    }

    setActiveBootcamp(bootcamp);
    setSelectedLesson(bootcamp.modules[0].lessons[0]);
    setPage("course");
  }

  function handleBack() {
    setPage("dashboard");
    setActiveBootcamp(null);
    setSelectedLesson(null);
  }

  function handleLogout() {
    localStorage.removeItem("lf_user");
    setUser(null);
    setPage("login");
  }

  function handleLessonSelect(lesson) {
    setSelectedLesson(lesson);
  }

  function handleMarkComplete() {
    if (!activeBootcamp || !selectedLesson) {
      return;
    }

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
