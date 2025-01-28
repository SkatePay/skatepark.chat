"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Import Next.js Link component

interface ChannelPageProps {
  params: { id: string };
}

interface Video {
  id: string;
  content: string; // This will contain the video URL as JSON
}

const ChannelPage = ({ params }: ChannelPageProps) => {
  const { id } = params;
  const [channel, setChannel] = useState<{ videos: Video[] } | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch the channel details from your API using the 'id'
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://api.skatepark.chat";

      fetch(`${baseUrl}/channel/${id}`)
        .then((response) => response.json())
        .then((data) => {
          // Filter videos to include only those with the ["t", "video"] tag
          const filteredVideos = data.videos.filter((video: Video) =>
            video.tags.some((tag) => tag[0] === "t" && tag[1] === "video")
          );
          setChannel({ videos: filteredVideos });
        });
    }
  }, [id]);

  if (!channel) {
    return <div>Loading...</div>;
  }

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
        {channel.videos.map((video) => {
          const videoUrl = JSON.parse(video.content).content;
          const videoId = videoUrl.split("/").pop()?.replace(".mov", "");
          const thumbnailUrl = `https://skateconnect.s3.us-west-2.amazonaws.com/${videoId}.jpg`;

          return (
            <div key={video.id} style={styles.videoContainer}>
              {/* Link the thumbnail to the dynamic video page */}
              <Link href={`/video/${videoId}`}>
                <div style={styles.thumbnailContainer}>
                  <img
                    src={thumbnailUrl}
                    alt="Video thumbnail"
                    style={styles.thumbnail}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none"; // Hide the broken image
                      const fallback = img.nextSibling as HTMLDivElement;
                      fallback.style.display = "flex"; // Show the fallback
                    }}
                  />
                  <div style={{ ...styles.fallback, display: "none" }}>
                    🏁 no thumbnail
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Styles for the grid layout and video thumbnails
const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // Responsive grid layout
    gap: "20px",
    padding: "20px",
  },
  videoContainer: {
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
  },
  thumbnail: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  thumbnailHover: {
    transform: "scale(1.05)", // Slight zoom on hover
  },
};

export default ChannelPage;
