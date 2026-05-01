import { useState } from "react";

const colors = ["#4f7cff", "#21c55d", "#f59e0b", "#ef476f", "#7c5cfc"];
const icons = ["YT", "AI", "JS", "PY", "ML"];

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 18% 0%, rgba(79, 124, 255, 0.13), transparent 28%), var(--bg)",
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    minHeight: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    background: "rgba(8, 10, 15, 0.86)",
    borderBottom: "1px solid var(--border)",
    backdropFilter: "blur(18px)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 850,
    fontSize: "18px",
  },
  mark: {
    width: "34px",
    height: "34px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    boxShadow: "0 12px 30px rgba(79, 124, 255, 0.24)",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    fontWeight: 800,
  },
  signOut: {
    border: "1px solid var(--border)",
    borderRadius: "12px",
    background: "var(--surface)",
    color: "var(--text)",
    padding: "10px 13px",
    cursor: "pointer",
    fontWeight: 700,
  },
  main: {
    maxWidth: "1080px",
    margin: "0 auto",
    padding: "42px 24px 64px",
  },
  hero: {
    marginBottom: "30px",
    animation: "fadeUp 420ms ease both",
  },
  title: {
    fontSize: "42px",
    lineHeight: 1.1,
    marginBottom: "10px",
    letterSpacing: "-0.03em",
  },
  muted: {
    color: "var(--muted)",
    fontSize: "16px",
    lineHeight: 1.6,
  },
  panel: {
    padding: "24px",
    borderRadius: "22px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    marginBottom: "34px",
    animation: "fadeUp 480ms ease both",
  },
  sectionTitle: {
    fontSize: "21px",
    marginBottom: "8px",
    letterSpacing: "-0.01em",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
    alignItems: "stretch",
  },
  input: {
    flex: 1,
    height: "50px",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    background: "#0d1017",
    color: "var(--text)",
    padding: "0 14px",
    outline: "none",
    fontSize: "15px",
    transition: "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
  },
  createButton: {
    minWidth: "150px",
    border: 0,
    borderRadius: "14px",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    color: "#fff",
    fontWeight: 850,
    cursor: "pointer",
    padding: "0 18px",
    boxShadow: "0 16px 34px rgba(79, 124, 255, 0.24)",
    display: "grid",
    placeItems: "center",
  },
  error: {
    color: "var(--danger)",
    fontSize: "13px",
    marginTop: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
    marginTop: "16px",
  },
  card: {
    position: "relative",
    overflow: "hidden",
    minHeight: "184px",
    padding: "24px",
    borderRadius: "20px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    cursor: "pointer",
    boxShadow: "0 18px 54px rgba(0, 0, 0, 0.18)",
    transition: "transform 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
  },
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
  },
  icon: {
    width: "46px",
    height: "46px",
    display: "grid",
    placeItems: "center",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: 900,
    marginBottom: "18px",
  },
  cardTitle: {
    fontSize: "17px",
    lineHeight: 1.35,
    marginBottom: "10px",
    letterSpacing: "-0.01em",
  },
  meta: {
    color: "var(--muted)",
    fontSize: "14px",
    marginBottom: "18px",
  },
  open: {
    color: "#cfd7ff",
    fontWeight: 800,
    fontSize: "13px",
  },
  empty: {
    border: "1px dashed var(--border)",
    borderRadius: "20px",
    padding: "30px",
    color: "var(--muted)",
    background: "rgba(18, 20, 26, 0.55)",
    marginTop: "16px",
  },
  spinner: {
    display: "inline-block",
    width: "15px",
    height: "15px",
    border: "2px solid rgba(255, 255, 255, 0.35)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 700ms linear infinite",
  },
};

function isLikelyYoutubeUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be");
  } catch {
    return false;
  }
}

function Dashboard({ user, bootcamps, setBootcamps, onOpenCourse, onLogout }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate() {
    const trimmedUrl = inputValue.trim();
    setError("");

    if (!isLikelyYoutubeUrl(trimmedUrl)) {
      setError("Paste a valid YouTube video or playlist URL.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/generate-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create bootcamp.");
      }

      const nextIndex = bootcamps.length % colors.length;
      const newBootcamp = {
        id: Date.now(),
        title: data.title,
        totalLessons: data.totalLessons,
        modules: data.modules,
        url: trimmedUrl,
        color: colors[nextIndex],
        icon: icons[nextIndex],
      };

      setBootcamps([newBootcamp, ...bootcamps]);
      setInputValue("");
    } catch (createError) {
      setError(createError.message || "Could not create this bootcamp. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <span style={styles.mark}>LF</span>
          LearnFlow
        </div>
        <div style={styles.navRight}>
          <div style={styles.avatar}>{user?.[0]?.toUpperCase()}</div>
          <span>{user}</span>
          <button
            style={styles.signOut}
            onClick={onLogout}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "var(--surface2)";
              event.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "var(--surface)";
              event.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Sign out
          </button>
        </div>
      </nav>
      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Hi, {user}</h1>
          <p style={styles.muted}>Build a structured course from any useful YouTube learning resource.</p>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Create Bootcamp</h2>
          <p style={styles.muted}>Paste any YouTube video or playlist URL.</p>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              onFocus={(event) => {
                event.currentTarget.style.borderColor = "var(--accent)";
                event.currentTarget.style.boxShadow = "0 0 0 4px rgba(79, 124, 255, 0.12)";
              }}
              onBlur={(event) => {
                event.currentTarget.style.borderColor = "var(--border)";
                event.currentTarget.style.boxShadow = "none";
              }}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <button
              style={styles.createButton}
              onClick={handleCreate}
              disabled={isLoading || !inputValue.trim()}
              onMouseEnter={(event) => {
                if (!isLoading && inputValue.trim()) {
                  event.currentTarget.style.transform = "translateY(-1px)";
                  event.currentTarget.style.boxShadow = "0 20px 42px rgba(79, 124, 255, 0.3)";
                }
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.boxShadow = "0 16px 34px rgba(79, 124, 255, 0.24)";
              }}
            >
              {isLoading ? <span style={styles.spinner} /> : "Create"}
            </button>
          </div>
          {error ? <p style={styles.error}>{error}</p> : null}
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Your Bootcamps</h2>
          {bootcamps.length === 0 ? (
            <div style={styles.empty}>No bootcamps yet. Paste a YouTube link above to create your first course.</div>
          ) : (
            <div style={styles.grid}>
              {bootcamps.map((bootcamp) => (
                <article
                  key={bootcamp.id}
                  style={styles.card}
                  onClick={() => onOpenCourse(bootcamp)}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform = "translateY(-4px)";
                    event.currentTarget.style.borderColor = bootcamp.color;
                    event.currentTarget.style.backgroundColor = "var(--surface2)";
                    event.currentTarget.style.boxShadow = "0 24px 70px rgba(0, 0, 0, 0.28)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform = "translateY(0)";
                    event.currentTarget.style.borderColor = "var(--border)";
                    event.currentTarget.style.backgroundColor = "var(--surface)";
                    event.currentTarget.style.boxShadow = "0 18px 54px rgba(0, 0, 0, 0.18)";
                  }}
                >
                  <div style={{ ...styles.accent, background: bootcamp.color }} />
                  <div style={{ ...styles.icon, background: `${bootcamp.color}22`, color: bootcamp.color }}>
                    {bootcamp.icon}
                  </div>
                  <h3 style={styles.cardTitle}>{bootcamp.title}</h3>
                  <p style={styles.meta}>{bootcamp.totalLessons} lessons</p>
                  <div style={styles.open}>Open Course</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
