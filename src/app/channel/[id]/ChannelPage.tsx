'use client'

import Link from 'next/link'
import Image from 'next/image'
import QRCodeGenerator from './components/QRCodeGenerator'
import { AboutStructure, Metadata } from './types'
import { ClipboardIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface Video {
  id: string
  content: string
}

interface Props {
  id: string
  videos: Video[]
  metadata?: Metadata
  about?: AboutStructure
}

export default function ChannelPage({ id, videos, metadata, about }: Readonly<Props>) {
  const channelName = metadata?.content ? JSON.parse(metadata.content).name : `Channel #${id}`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.channelHeader}>
          <Link href={`/chat/${id}`} className="text-blue-600 hover:underline dark:text-blue-400">
            💬
          </Link>
          <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
            SkateConnect
          </Link>{' '}
          {channelName}{' '}
          <button
            onClick={() => handleCopy(id)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            style={styles.copyButton}
          >
            <ClipboardIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Metadata */}
        {about && (
          <div style={styles.aboutSection}>
            {about.location && (
              <p>
                📍 <strong>Location:</strong> {about.location.latitude}, {about.location.longitude}
              </p>
            )}
            {about.description && (
              <p>
                📜 <strong>Description:</strong> {about.description}
              </p>
            )}
            {about.note && (
              <p>
                📝 <strong>Note:</strong> {about.note}
              </p>
            )}
          </div>
        )}

        {/* QR Code */}
        <QRCodeGenerator />

        {/* Video Section */}
        {videos.length === 0 ? (
          <div style={styles.noVideos}>No videos found.</div>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </div>
    </div>
  )
}

function VideoGrid({ videos }: Readonly<{ videos: Video[] }>) {
  return (
    <div style={styles.grid}>
      {videos.map((video) => {
        let videoUrl
        try {
          videoUrl = JSON.parse(video.content).content
        } catch (error) {
          console.error(error, video.content)
          return null
        }

        const videoId = videoUrl.split('/').pop()?.replace('.mov', '')
        const thumbnailUrl = `https://skateconnect.s3.us-west-2.amazonaws.com/${videoId}.jpg`

        return (
          <div key={video.id} style={styles.videoContainer}>
            <Link href={`/video/${videoId}`}>
              <div style={styles.thumbnailContainer}>
                <Image
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  width={320}
                  height={180}
                  style={styles.thumbnail}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.style.display = 'none'
                    const fallback = img.nextSibling as HTMLDivElement
                    fallback.style.display = 'flex'
                  }}
                />
                <div style={{ ...styles.fallback, display: 'none' }}>🏁 No thumbnail</div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    maxWidth: '1400px', // Prevents excessive stretching
    margin: '0 auto',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    textAlign: 'center',
    padding: '20px',
    width: '100%',
  },

  channelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  copyButton: {
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
  },

  aboutSection: {
    background: '#222',
    color: '#ddd',
    padding: '12px 20px',
    borderRadius: '12px',
    maxWidth: '600px',
    textAlign: 'center',
    marginBottom: '20px',
  },

  // ✅ **Fix Grid Centering for Single Video**
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Allows single videos to center
    gap: '20px',
    padding: '20px',
    width: '100%',
    maxWidth: '1400px', // Prevents stretching
    justifyContent: 'center', // Ensures even alignment
    placeItems: 'center', // Centers single video properly
  },

  noVideos: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '30vh',
    textAlign: 'center',
  },

  videoContainer: {
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },

  thumbnail: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },

  thumbnailContainer: {
    position: 'relative',
    width: '100%',
  },

  fallback: {
    height: '320px',
    width: '180px',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#eee',
    color: '#555',
    fontSize: '14px',
  },
}
