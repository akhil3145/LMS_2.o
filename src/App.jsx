import { useState } from "react";
import Sidebar from "./components/Sidebar";
import VideoPlayer from "./components/VideoPlayer";

const modules = [
  {
    title: "Module 1: Foundations",
    lessons: [
      { title: "Introduction to JavaScript", videoId: "W6NZfCO5SIk" },
      { title: "Variables & Data Types",      videoId: "edlFjlzxkSI" },
      { title: "Functions & Scope",           videoId: "xUI5Tsl2JpY" },
    ],
  },
  {
    title: "Module 2: React Basics",
    lessons: [
      { title: "What is React?",    videoId: "Ke90Tje7VS0" },
      { title: "JSX & Components",  videoId: "SqcY0GlETPk" },
      { title: "Props & State",     videoId: "IYvD9oBCuJI" },
    ],
  },
  {
    title: "Module 3: Hooks & Patterns",
    lessons: [
      { title: "useState & useEffect", videoId: "O6P86uwfdR0" },
      { title: "Custom Hooks",         videoId: "6ThXsUwLWvc" },
    ],
  },
];

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0f1117",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "36px 48px",
  },
  content: {
    maxWidth: "860px",
  },
};

function App() {
  const [selectedLesson, setSelectedLesson] = useState(modules[0].lessons[0]);

  return (
    <div style={styles.app}>
      <Sidebar
        modules={modules}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
      />
      <main style={styles.main}>
        <div style={styles.content}>
          <VideoPlayer selectedLesson={selectedLesson} />
        </div>
      </main>
    </div>
  );
}

export default App;
