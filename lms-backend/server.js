import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lms-2-o.vercel.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// VERY IMPORTANT (handles preflight requests)
app.options("*", cors());

function extractPlaylistId(url) {
  return new URL(url).searchParams.get("list");
}

function extractVideoId(url) {
  const parsedUrl = new URL(url);

  if (parsedUrl.searchParams.get("v")) {
    return parsedUrl.searchParams.get("v");
  }

  if (parsedUrl.hostname.includes("youtu.be")) {
    return parsedUrl.pathname.split("/").filter(Boolean)[0] || null;
  }

  return null;
}

function parseDurationToSeconds(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) {
    return 0;
  }

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

function getSectionCount(totalSeconds) {
  if (totalSeconds < 600) {
    return 2;
  }

  if (totalSeconds <= 1800) {
    return 4;
  }

  if (totalSeconds <= 3600) {
    return 6;
  }

  return 8;
}

function createSections(videoId, totalSeconds) {
  const sectionNames = [
    "Introduction",
    "Foundations",
    "Core Concepts",
    "Worked Example",
    "Practice Section",
    "Deep Dive",
    "Common Mistakes",
    "Wrap-up",
  ];
  const sectionCount = getSectionCount(totalSeconds);
  const sectionLength = Math.ceil(totalSeconds / sectionCount);

  return Array.from({ length: sectionCount }, (_item, index) => {
    const startSeconds = index * sectionLength;
    const endSeconds = index === sectionCount - 1 ? totalSeconds : Math.min(totalSeconds, (index + 1) * sectionLength);

    return {
      title: sectionNames[index],
      videoId,
      startSeconds,
      endSeconds,
    };
  });
}

function groupIntoModules(videos) {
  const modules = [];

  for (let index = 0; index < videos.length; index += 5) {
    modules.push({
      title: `Module ${modules.length + 1}`,
      lessons: videos.slice(index, index + 5),
    });
  }

  return modules;
}

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/generate-course", async (request, response) => {
  const { url } = request.body ?? {};

  if (!url) {
    return response.status(400).json({ error: "url is required." });
  }

  if (!apiKey || apiKey === "PASTE_YOUR_KEY_HERE") {
    return response.status(500).json({ error: "YouTube API key is missing in the backend .env file." });
  }

  try {
    if (url.includes("list=")) {
      const playlistId = extractPlaylistId(url);

      if (!playlistId) {
        return response.status(400).json({ error: "Invalid playlist URL." });
      }

      const playlistResponse = await axios.get("https://www.googleapis.com/youtube/v3/playlists", {
        params: {
          part: "snippet",
          id: playlistId,
          key: apiKey,
        },
      });

      const playlist = playlistResponse.data.items?.[0];

      if (!playlist) {
        return response.status(404).json({ error: "Playlist not found." });
      }

      const videos = [];
      let nextPageToken = "";

      do {
        const playlistItemsResponse = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
          params: {
            part: "snippet",
            playlistId,
            maxResults: 50,
            pageToken: nextPageToken || undefined,
            key: apiKey,
          },
        });

        const items = playlistItemsResponse.data.items || [];

        items.forEach((item) => {
          const title = item.snippet?.title;
          const videoId = item.snippet?.resourceId?.videoId;

          if (!title || !videoId || title === "Deleted video" || title === "Private video") {
            return;
          }

          videos.push({
            title,
            videoId,
            startSeconds: 0,
            endSeconds: null,
          });
        });

        nextPageToken = playlistItemsResponse.data.nextPageToken || "";
      } while (nextPageToken);

      return response.json({
        type: "playlist",
        title: playlist.snippet.title,
        totalLessons: videos.length,
        modules: groupIntoModules(videos),
      });
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      return response.status(400).json({ error: "Invalid YouTube video URL." });
    }

    const videoResponse = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        part: "snippet,contentDetails",
        id: videoId,
        key: apiKey,
      },
    });

    const video = videoResponse.data.items?.[0];

    if (!video) {
      return response.status(404).json({ error: "Video not found." });
    }

    const totalSeconds = parseDurationToSeconds(video.contentDetails?.duration || "");
    const sections = createSections(videoId, totalSeconds);

    return response.json({
      type: "video",
      title: video.snippet.title,
      totalLessons: sections.length,
      modules: [
        {
          title: "Full Video",
          lessons: sections,
        },
      ],
    });
  } catch (error) {
    return response.status(500).json({
      error: error.response?.data?.error?.message || error.message || "Failed to fetch YouTube data.",
    });
  }
});

app.listen(port, () => {
  console.log(`LMS backend running on http://localhost:${port}`);
});
