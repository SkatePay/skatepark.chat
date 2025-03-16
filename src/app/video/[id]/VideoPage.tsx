'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface Props {
  id: string
}

export default function VideoPage({ id }: Readonly<Props>) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      setVideoUrl(`https://skateconnect.s3.us-west-2.amazonaws.com/${id}.mov`)
    }
  }, [id])

  if (!videoUrl) {
    return <div>Loading video...</div>
  }

  const thumbnailUrl = videoUrl.replace('.mov', '.jpg')
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `Skate Video - ${id}`,
    description: `Skateboarding action at Venice Beach Skate Park. ${id}`,
    thumbnailUrl,
    contentUrl: videoUrl,
    embedUrl: `https://skatepark.chat/video/${id}`,
  }

  return (
    <div style={styles.container}>
      {/* Inject VideoObject schema */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <h1>
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
          SkateConnect
        </Link>{' '}
        Video Player
      </h1>
      <div style={styles.videoWrapper}>
        <video style={styles.video} controls autoPlay>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  videoWrapper: {
    backgroundColor: 'black',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  video: {
    width: '100%',
    maxWidth: '1000px',
    height: 'auto',
  },
}
