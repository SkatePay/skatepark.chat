"use client";

import Link from "next/link";
import Image from "next/image";
import QRCodeGenerator from "./components/QRCodeGenerator";

interface Video {
  id: string;
  content: string; // This contains the video URL as JSON
}

interface Props {
  id: string;
  videos: Video[];
}

export default function ChannelPage({ id, videos }: Readonly<Props>) {
  const videoSection = (
    <div style={styles.grid}>
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
                <Image
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  width={320} // Set an appropriate width
                  height={180} // Set an appropriate height
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
  );

  const notFoundSection = <div style={styles.noVideos}>No videos found.</div>;

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
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          SkateConnect
        </Link>{" "}
        Channel #{id}{" "}
        <Link
          href={`/chat/${id}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          💬
        </Link>
      </h1>
      <QRCodeGenerator />
      {!videos.length ? notFoundSection : videoSection}
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
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh", // Ensures full viewport height
    textAlign: "center",
  },
  noVideos: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Ensures full width
    height: "50vh", // Keeps vertical centering
    textAlign: "center",
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
