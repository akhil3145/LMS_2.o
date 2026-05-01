import { useEffect, useRef, useState } from "react";

const WATCH_THRESHOLD = 90;

const styles = {
  shell: {
    maxWidth: "1020px",
    margin: "0 auto",
    animation: "fadeUp 360ms ease both",
  },
  header: {
    marginBottom: "20px",
  },
  eyebrow: {
    color: "var(--muted2)",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 850,
    marginBottom: "8px",
  },
  title: {
    fontSize: "30px",
    lineHeight: 1.2,
    letterSpacing: "-0.025em",
  },
  videoWrap: {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid var(--border)",
    background: "#000",
    boxShadow: "var(--shadow)",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: 0,
    display: "block",
  },
  watchPanel: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginTop: "18px",
    padding: "14px 16px",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    background: "rgba(17, 20, 28, 0.84)",
  },
  watchTrack: {
    flex: 1,
    height: "9px",
    borderRadius: "999px",
    background: "#0d1017",
    border: "1px solid var(--border)",
    overflow: "hidden",
  },
  watchFill: {
    height: "100%",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    transition: "width 180ms ease",
  },
  watchText: {
    minWidth: "150px",
    color: "var(--muted)",
    fontSize: "13px",
    fontWeight: 800,
    textAlign: "right",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  button: {
    border: 0,
    borderRadius: "15px",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 850,
    padding: "14px 20px",
    boxShadow: "0 16px 34px rgba(79, 124, 255, 0.24)",
  },
  buttonLocked: {
    background: "var(--surface3)",
    color: "var(--muted)",
    boxShadow: "none",
  },
};

function loadYoutubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  return new Promise((resolve) => {
    const existingScript = document.querySelector("script[src='https://www.youtube.com/iframe_api']");

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  });
}

function VideoPlayer({ selectedLesson, onMarkComplete }) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const watchedSecondsRef = useRef(0);
  const lastTickRef = useRef(null);
  const [watchPercent, setWatchPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const startSeconds = selectedLesson.startSeconds || 0;
  const endSeconds = selectedLesson.endSeconds;
  const canMarkComplete = watchPercent >= WATCH_THRESHOLD;

  useEffect(() => {
    let isMounted = true;

    setWatchPercent(0);
    setIsReady(false);
    watchedSecondsRef.current = 0;
    lastTickRef.current = null;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    loadYoutubeApi().then((YT) => {
      if (!isMounted || !iframeRef.current) {
        return;
      }

      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }

      playerRef.current = new YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            if (isMounted) {
              setIsReady(true);
            }
          },
          onStateChange: (event) => {
            const isPlaying = event.data === YT.PlayerState.PLAYING;

            if (!isPlaying) {
              lastTickRef.current = null;
              return;
            }

            lastTickRef.current = Date.now();
          },
        },
      });
    });

    intervalRef.current = setInterval(() => {
      const player = playerRef.current;

      if (!player?.getPlayerState || player.getPlayerState() !== window.YT?.PlayerState?.PLAYING) {
        lastTickRef.current = null;
        return;
      }

      const now = Date.now();
      const elapsedSeconds = lastTickRef.current ? (now - lastTickRef.current) / 1000 : 0;
      lastTickRef.current = now;

      const duration = player.getDuration?.() || 0;
      const sectionEnd = endSeconds !== null && endSeconds !== undefined ? endSeconds : duration;
      const sectionLength = Math.max(1, sectionEnd - startSeconds);

      watchedSecondsRef.current = Math.min(sectionLength, watchedSecondsRef.current + elapsedSeconds);
      setWatchPercent(Math.min(100, Math.round((watchedSecondsRef.current / sectionLength) * 100)));
    }, 1000);

    return () => {
      isMounted = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [endSeconds, selectedLesson.videoId, startSeconds]);

  const params = new URLSearchParams({
    enablejsapi: "1",
    rel: "0",
    modestbranding: "1",
    origin: window.location.origin,
  });

  if (startSeconds > 0) {
    params.set("start", startSeconds);
  }

  if (endSeconds !== null && endSeconds !== undefined) {
    params.set("end", endSeconds);
  }

  const videoUrl = `https://www.youtube.com/embed/${selectedLesson.videoId}?${params.toString()}`;

  function handleCompleteClick() {
    if (!canMarkComplete) {
      return;
    }

    onMarkComplete();
  }

  return (
    <section style={styles.shell}>
      <div style={styles.header}>
        <div style={styles.eyebrow}>Now learning</div>
        <h1 style={styles.title}>{selectedLesson.title}</h1>
      </div>
      <div style={styles.videoWrap}>
        <iframe
          ref={iframeRef}
          style={styles.iframe}
          src={videoUrl}
          title={selectedLesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div style={styles.watchPanel}>
        <div style={styles.watchTrack}>
          <div style={{ ...styles.watchFill, width: `${watchPercent}%` }} />
        </div>
        <div style={styles.watchText}>
          {isReady ? `${watchPercent}% watched` : "Loading player..."}
        </div>
      </div>

      <div style={styles.actionRow}>
        <button
          style={{ ...styles.button, ...(!canMarkComplete ? styles.buttonLocked : {}) }}
          onClick={handleCompleteClick}
          disabled={!canMarkComplete}
          title={!canMarkComplete ? "Watch at least 90% of this lesson to unlock completion." : "Mark this lesson complete."}
          onMouseEnter={(event) => {
            if (canMarkComplete) {
              event.currentTarget.style.transform = "translateY(-1px)";
              event.currentTarget.style.boxShadow = "0 20px 42px rgba(79, 124, 255, 0.3)";
            }
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "translateY(0)";
            event.currentTarget.style.boxShadow = canMarkComplete
              ? "0 16px 34px rgba(79, 124, 255, 0.24)"
              : "none";
          }}
        >
          {canMarkComplete ? "Mark Complete & Continue" : "Watch 90% to Complete"}
        </button>
      </div>
    </section>
  );
}

export default VideoPlayer;
