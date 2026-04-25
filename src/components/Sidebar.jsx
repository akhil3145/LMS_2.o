const styles = {
  sidebar: {
    width: "260px",
    minWidth: "260px",
    height: "100vh",
    overflowY: "auto",
    backgroundColor: "#1a1d23",
    borderRight: "1px solid #2c2f38",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "20px 16px 16px",
    borderBottom: "1px solid #2c2f38",
  },
  courseLabel: {
    fontSize: "10px",
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  },
  courseTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#e2e8f0",
    lineHeight: "1.4",
  },
  nav: {
    padding: "8px 0",
    flex: 1,
  },
  moduleTitle: {
    padding: "10px 16px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    userSelect: "none",
  },
  lesson: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 16px 9px 28px",
    fontSize: "13.5px",
    color: "#cbd5e1",
    cursor: "pointer",
    borderLeft: "2px solid transparent",
  },
  lessonActive: {
    backgroundColor: "#1e3a5f",
    color: "#60a5fa",
    borderLeft: "2px solid #3b82f6",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#4b5563",
    flexShrink: 0,
  },
  dotActive: {
    backgroundColor: "#3b82f6",
  },
};

function Sidebar({ modules, selectedLesson, setSelectedLesson }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.courseLabel}>Course</div>
        <div style={styles.courseTitle}>React & JavaScript Mastery</div>
      </div>

      <nav style={styles.nav}>
        {modules.map((module) => (
          <div key={module.title}>
            <div style={styles.moduleTitle}>{module.title}</div>

            {module.lessons.map((lesson) => {
              const isActive = selectedLesson.title === lesson.title;
              return (
                <div
                  key={lesson.title}
                  style={{ ...styles.lesson, ...(isActive ? styles.lessonActive : {}) }}
                  onClick={() => setSelectedLesson(lesson)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#252830";
                      e.currentTarget.style.color = "#e2e8f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#cbd5e1";
                    }
                  }}
                >
                  <span style={{ ...styles.dot, ...(isActive ? styles.dotActive : {}) }} />
                  {lesson.title}
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
