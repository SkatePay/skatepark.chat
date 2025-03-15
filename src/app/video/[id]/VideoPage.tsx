'use client'

import { useState, useEffect } from 'react'

interface Props {
  id: string
}

export default function VideoPage({ id }: Readonly<Props>) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    // In a real-world scenario, you would fetch the S3 URL using the ID
    if (id) {
      setVideoUrl(`https://skateconnect.s3.us-west-2.amazonaws.com/${id}.mov`)
    }
  }, [id])

  if (!videoUrl) {
    return <div>Loading video...</div>
  }

  return (
    <div style={styles.container}>
      <h1>SkateConnect Video Player</h1>
      <div style={styles.videoWrapper}>
        <video style={styles.video} controls autoPlay>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

// Define responsive styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // Ensure the container takes up at least the full viewport height
    padding: '20px', // Margin around the video
    boxSizing: 'border-box',
    width: '100vw', // Full viewport width
  },
  videoWrapper: {
    maxWidth: '100%', // Max width is the full width of the viewport
    maxHeight: '100%', // Max height is the full height of the viewport
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Dark background for contrast
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for better visual separation
    overflow: 'hidden', // Ensures video doesn’t overflow the container
  },
  video: {
    width: '100%', // Make the video take the full width of the container
    height: 'auto', // Ensure aspect ratio is maintained
    maxHeight: 'calc(100vh - 40px)', // Prevent the video from going beyond the viewport height (with padding)
  },
}
