const styles = {
  sidebar: {
    width: "280px",
    minWidth: "280px",
    height: "100vh",
    overflowY: "auto",
    background: "rgba(17, 20, 28, 0.98)",
    borderRight: "1px solid var(--border)",
  },
  header: {
    padding: "18px",
    borderBottom: "1px solid var(--border)",
  },
  back: {
    width: "100%",
    minHeight: "42px",
    border: "1px solid rgba(79, 124, 255, 0.36)",
    borderRadius: "13px",
    background: "rgba(79, 124, 255, 0.12)",
    color: "#dce5ff",
    cursor: "pointer",
    fontWeight: 850,
    marginBottom: "18px",
  },
  label: {
    color: "var(--muted2)",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 850,
    marginBottom: "8px",
  },
  title: {
    fontSize: "16px",
    lineHeight: 1.4,
    letterSpacing: "-0.01em",
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
    fontWeight: 850,
    marginBottom: "10px",
  },
  progressTrack: {
    height: "10px",
    borderRadius: "999px",
    background: "#0d1017",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    transition: "width 180ms ease",
  },
  nav: {
    padding: "10px 0 18px",
  },
  moduleTitle: {
    padding: "16px 18px 8px",
    color: "var(--muted2)",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 850,
  },
  lesson: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "3px 10px",
    padding: "11px 10px",
    borderRadius: "13px",
    border: "1px solid transparent",
    borderLeft: "3px solid transparent",
    color: "#cbd2e8",
    cursor: "pointer",
    fontSize: "13px",
    lineHeight: 1.35,
    transition: "background-color 160ms ease, border-color 160ms ease, color 160ms ease",
  },
  lessonActive: {
    background: "rgba(79, 124, 255, 0.16)",
    border: "1px solid rgba(79, 124, 255, 0.34)",
    borderLeft: "3px solid var(--accent)",
    color: "#f4f7ff",
  },
  dot: {
    width: "20px",
    height: "20px",
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
    background: "var(--success)",
    borderColor: "var(--success)",
  },
};

function Sidebar({ bootcamp, selectedLesson, onLessonSelect, onBack, completedLessons }) {
  const allLessons = bootcamp.modules.flatMap((module) => module.lessons);
  const progressPercent = allLessons.length ? Math.round((completedLessons.size / allLessons.length) * 100) : 0;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <button
          style={styles.back}
          onClick={onBack}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "translateY(-1px)";
            event.currentTarget.style.background = "rgba(79, 124, 255, 0.18)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "translateY(0)";
            event.currentTarget.style.background = "rgba(79, 124, 255, 0.12)";
          }}
        >
          Back to Dashboard
        </button>
        <div style={styles.label}>Current course</div>
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
                      event.currentTarget.style.borderColor = "var(--border)";
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.background = "transparent";
                      event.currentTarget.style.borderColor = "transparent";
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
                    {isComplete ? "\u2713" : ""}
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
