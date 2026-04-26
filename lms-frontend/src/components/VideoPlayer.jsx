const styles = {
  shell: {
    maxWidth: "980px",
    margin: "0 auto",
    animation: "fadeUp 360ms ease both",
  },
  title: {
    fontSize: "28px",
    lineHeight: 1.22,
    marginBottom: "18px",
  },
  videoWrap: {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid var(--border)",
    background: "#000",
    boxShadow: "0 28px 90px rgba(0, 0, 0, 0.34)",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: 0,
    display: "block",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "18px",
  },
  button: {
    border: 0,
    borderRadius: "14px",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 850,
    padding: "14px 18px",
    boxShadow: "0 16px 34px rgba(79, 124, 255, 0.24)",
  },
};

function VideoPlayer({ selectedLesson, onMarkComplete }) {
  const params = new URLSearchParams();

  if (selectedLesson.startSeconds && selectedLesson.startSeconds > 0) {
    params.set("start", selectedLesson.startSeconds);
  }

  if (selectedLesson.endSeconds !== null && selectedLesson.endSeconds !== undefined) {
    params.set("end", selectedLesson.endSeconds);
  }

  const queryString = params.toString();
  const videoUrl = `https://www.youtube.com/embed/${selectedLesson.videoId}${queryString ? `?${queryString}` : ""}`;

  return (
    <section style={styles.shell}>
      <h1 style={styles.title}>{selectedLesson.title}</h1>
      <div style={styles.videoWrap}>
        <iframe
          style={styles.iframe}
          src={videoUrl}
          title={selectedLesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div style={styles.actionRow}>
        <button style={styles.button} onClick={onMarkComplete}>
          Mark complete and continue
        </button>
      </div>
    </section>
  );
}

export default VideoPlayer;
