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
    return (
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        <div className="row-start-2">Loading video...</div>
        <Footer />
      </div>
    )
  }

  const thumbnailUrl = videoUrl.replace('.mov', '.jpg')
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `Skate Video - ${id}`,
    description: `Skateboarding action at Venice Beach Skate Park. ${id}`,
    thumbnailUrl,
    contentUrl: videoUrl,
    embedUrl: `https://skateconnect.app/video/${id}`,
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-8 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      {/* Inject VideoObject schema */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <main className="row-start-2 flex w-full max-w-6xl flex-col items-center gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
              SkateConnect
            </Link>{' '}
            Video Player
          </h1>
        </header>

        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-xl">
          <video
            className="w-full"
            controls
            autoPlay
            playsInline
            style={{ aspectRatio: '16/9' }} // Maintains proper aspect ratio
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <Link href="/channels">
          <button className="transform rounded-full bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-700">
            Go to Spots
          </button>
        </Link>
      </main>
    </div>
  )
}
