"use client";

import Link from "next/link";

interface Video {
  id: string;
  content: string; // This contains the video URL as JSON
}

interface Props {
  id: string;
  videos: Video[];
}

export default function ChannelPage({ id, videos }: Readonly<Props>) {
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          marginTop: "20px",
          wordWrap: "break-word",
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        SkateConnect Channel #{id}
      </h1>
      <div style={styles.grid}>
        {!videos.length && <div>No videos found.</div>}
        {videos.map((video) => {
          let videoUrl;
          try {
            videoUrl = JSON.parse(video.content).content;
          } catch (error) {
            console.error(error, video.content);
            return null;
          }

          const videoId = videoUrl.split("/").pop()?.replace(".mov", "");
          const thumbnailUrl = `https://skateconnect.s3.us-west-2.amazonaws.com/${videoId}.jpg`;

          return (
            <div key={video.id} style={styles.videoContainer}>
              <Link href={`/video/${videoId}`}>
                <div style={styles.thumbnailContainer}>
                  <img
                    src={thumbnailUrl}
                    alt="Video thumbnail"
                    style={styles.thumbnail}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      const fallback = img.nextSibling as HTMLDivElement;
                      fallback.style.display = "flex";
                    }}
                  />
                  <div style={{ ...styles.fallback, display: "none" }}>
                    🏁 No thumbnail
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  videoContainer: {
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  thumbnail: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
  },
  fallback: {
    width: "100%",
    height: "100px",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    background: "#eee",
    color: "#555",
    fontSize: "14px",
  },
};
