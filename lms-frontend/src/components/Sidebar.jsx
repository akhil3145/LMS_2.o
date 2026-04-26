const styles = {
  sidebar: {
    width: "260px",
    minWidth: "260px",
    height: "100vh",
    overflowY: "auto",
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
  },
  header: {
    padding: "18px",
    borderBottom: "1px solid var(--border)",
  },
  back: {
    width: "100%",
    height: "40px",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    background: "var(--surface2)",
    color: "var(--text)",
    cursor: "pointer",
    fontWeight: 800,
    marginBottom: "16px",
  },
  title: {
    fontSize: "15px",
    lineHeight: 1.4,
  },
  progress: {
    padding: "18px",
    borderBottom: "1px solid var(--border)",
  },
  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd2e8",
    fontSize: "13px",
    fontWeight: 800,
    marginBottom: "10px",
  },
  progressTrack: {
    height: "8px",
    borderRadius: "999px",
    background: "#0d1017",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
  },
  nav: {
    padding: "10px 0 18px",
  },
  moduleTitle: {
    padding: "14px 18px 8px",
    color: "var(--muted)",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 850,
  },
  lesson: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "2px 10px",
    padding: "10px",
    borderRadius: "12px",
    borderLeft: "3px solid transparent",
    color: "#cbd2e8",
    cursor: "pointer",
    fontSize: "13px",
    lineHeight: 1.35,
  },
  lessonActive: {
    background: "rgba(79, 124, 255, 0.14)",
    borderLeft: "3px solid var(--accent)",
    color: "#f4f7ff",
  },
  dot: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#0d1017",
    border: "1px solid var(--border)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 900,
    flexShrink: 0,
  },
  dotActive: {
    background: "var(--accent)",
    borderColor: "var(--accent)",
  },
  dotDone: {
    background: "#21c55d",
    borderColor: "#21c55d",
  },
};

function Sidebar({ bootcamp, selectedLesson, onLessonSelect, onBack, completedLessons }) {
  const allLessons = bootcamp.modules.flatMap((module) => module.lessons);
  const progressPercent = allLessons.length ? Math.round((completedLessons.size / allLessons.length) * 100) : 0;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <button style={styles.back} onClick={onBack}>
          Back to Dashboard
        </button>
        <h2 style={styles.title}>{bootcamp.title}</h2>
      </div>

      <div style={styles.progress}>
        <div style={styles.progressTop}>
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
        </div>
      </div>

      <nav style={styles.nav}>
        {bootcamp.modules.map((module) => (
          <div key={module.title}>
            <div style={styles.moduleTitle}>{module.title}</div>
            {module.lessons.map((lesson) => {
              const isActive = selectedLesson === lesson;
              const isComplete = completedLessons.has(lesson.title);

              return (
                <div
                  key={`${lesson.videoId}-${lesson.title}`}
                  style={{ ...styles.lesson, ...(isActive ? styles.lessonActive : {}) }}
                  onClick={() => onLessonSelect(lesson)}
                  onMouseEnter={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.background = "var(--surface2)";
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span
                    style={{
                      ...styles.dot,
                      ...(isActive ? styles.dotActive : {}),
                      ...(isComplete ? styles.dotDone : {}),
                    }}
                  >
                    {isComplete ? "✓" : ""}
                  </span>
                  <span>{lesson.title}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
