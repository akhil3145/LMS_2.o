const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#f1f5f9",
    lineHeight: "1.3",
    margin: 0,
  },
  videoWrapper: {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#000",
    border: "1px solid #2c2f38",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
  },
};

function VideoPlayer({ selectedLesson }) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{selectedLesson.title}</h1>

      <div style={styles.videoWrapper}>
        <iframe
          style={styles.iframe}
          src={`https://www.youtube.com/embed/${selectedLesson.videoId}?rel=0&modestbranding=1`}
          title={selectedLesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default VideoPlayer;
