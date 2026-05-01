import { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at 50% 0%, rgba(79, 124, 255, 0.2), transparent 32%), radial-gradient(circle at 80% 80%, rgba(45, 212, 125, 0.09), transparent 24%), var(--bg)",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    padding: "36px",
    borderRadius: "24px",
    background: "rgba(18, 20, 26, 0.94)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    animation: "fadeUp 420ms ease both",
  },
  logoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
  },
  brand: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "0.2px",
  },
  title: {
    fontSize: "32px",
    lineHeight: 1.15,
    marginBottom: "10px",
    letterSpacing: "-0.02em",
  },
  subtext: {
    color: "var(--muted)",
    fontSize: "15px",
    lineHeight: 1.6,
    marginBottom: "24px",
  },
  label: {
    display: "block",
    color: "#cbd2e8",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    height: "48px",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    background: "#0d1017",
    color: "var(--text)",
    padding: "0 14px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
  },
  error: {
    color: "#ff6b7a",
    fontSize: "13px",
    marginTop: "10px",
  },
  button: {
    width: "100%",
    height: "48px",
    border: 0,
    borderRadius: "14px",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: "18px",
    boxShadow: "0 16px 34px rgba(79, 124, 255, 0.26)",
    display: "grid",
    placeItems: "center",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.35)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 700ms linear infinite",
  },
};

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = !username.trim() || isLoading;

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter your username.");
      return;
    }

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      onLogin(trimmedUsername);
    }, 600);
  }

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.logoWrap}>
          <svg width="58" height="58" viewBox="0 0 58 58" role="img" aria-label="LearnFlow">
            <defs>
              <linearGradient id="learnflow-gradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#4f7cff" />
                <stop offset="100%" stopColor="#7c5cfc" />
              </linearGradient>
            </defs>
            <path d="M29 3 51.5 16v26L29 55 6.5 42V16L29 3Z" fill="url(#learnflow-gradient)" />
            <path d="M20 31.5 26 37l13-16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={styles.brand}>LearnFlow</div>
        </div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtext}>Turn YouTube lessons into focused bootcamps and keep your progress in one place.</p>
        <label style={styles.label} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          style={styles.input}
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            if (error) {
              setError("");
            }
          }}
          onFocus={(event) => {
            event.currentTarget.style.borderColor = "var(--accent)";
            event.currentTarget.style.boxShadow = "0 0 0 4px rgba(79, 124, 255, 0.14)";
          }}
          onBlur={(event) => {
            event.currentTarget.style.borderColor = "var(--border)";
            event.currentTarget.style.boxShadow = "none";
          }}
          placeholder="Enter your name"
        />
        {error ? <p style={styles.error}>{error}</p> : null}
        <button
          style={styles.button}
          type="submit"
          disabled={isDisabled}
          onMouseEnter={(event) => {
            if (!isDisabled) {
              event.currentTarget.style.transform = "translateY(-1px)";
              event.currentTarget.style.boxShadow = "0 20px 42px rgba(79, 124, 255, 0.32)";
            }
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "translateY(0)";
            event.currentTarget.style.boxShadow = "0 16px 34px rgba(79, 124, 255, 0.26)";
          }}
        >
          {isLoading ? <span style={styles.spinner} /> : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default Login;
