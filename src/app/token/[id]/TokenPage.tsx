'use client'

import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

interface Props {
  id: string
}

// Define the URLs as constants
const SKATECONNECT_URL =
  process.env.NEXT_PUBLIC_DOWNLOAD_URL ?? 'https://apps.apple.com/us/app/skateconnect/id6677058833'
const RABOTA_URL =
  process.env.NEXT_RABOTA_URL ??
  'https://prorobot.ai/token/DaEivka37g83C3QMokZmBsUNsAHoh1tm8HhKh8r4Cen5'
const YOUTUBE_VIDEO_ID = 'MsUf2i3YJKI' //  Use ONLY the video ID here.  Change this to the correct ID.

export default function TokenPerksPage({ id }: Readonly<Props>) {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 p-8">
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: `Token Perks - $RABOTA on SkateConnect - ${id}`,
                description:
                  'Discover how $RABOTA tokens enhance your SkateConnect experience. Unlock exclusive features, earn rewards, and connect with the skateboarding community.',
              }),
            }}
          />
        </Head>

        {/* Dynamic Banner with SkateConnect Link */}
        <div className="mb-8 flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-teal-600 py-4 text-center text-white shadow-md transition-transform hover:scale-105 sm:flex-row">
          <p className="mb-2 mr-2 text-lg font-semibold tracking-wide sm:mb-0">
            🛹 Power Up Your{' '}
            <Link
              href={SKATECONNECT_URL}
              className="text-blue-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkateConnect
            </Link>{' '}
            Experience with{' '}
            <Link
              href={RABOTA_URL}
              className="text-blue-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              $RABOTA
            </Link>
            ! ⚡
          </p>
          <Link href="/" className="text-sm text-blue-300 hover:underline">
            Back to SkateConnect
          </Link>
        </div>

        <h1 className="mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-center text-5xl font-extrabold text-transparent">
          <Link href={RABOTA_URL} className="transition-colors hover:text-blue-300">
            $RABOTA
          </Link>{' '}
          Token: Your Key to{' '}
          <Link
            href={SKATECONNECT_URL}
            className="transition-colors hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            SkateConnect
          </Link>
        </h1>

        {/* Video Embed Section */}
        <div className="mx-auto mb-12 w-full max-w-2xl">
          {/* Constrain overall width */}
          {/* Video Container */}
          <div className="relative mx-auto w-full" style={{ maxWidth: '320px' }}>
            {/* Adjust maxWidth for portrait video */}
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-xl">
              {/* 9:16 aspect ratio for portrait */}
              <iframe
                className="absolute left-0 top-0 h-full w-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                title="$RABOTA Token Explanation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          {/* Description */}
          <p className="mt-4 text-center text-lg text-gray-400">
            Learn more about how $RABOTA works within the SkateConnect ecosystem.
          </p>
        </div>

        {/* Token Utility Section with Animated Cards */}
        <div className="mx-auto w-full max-w-6xl text-center">
          <h2 className="mb-6 text-4xl font-semibold text-gray-200">
            Why{' '}
            <Link href={RABOTA_URL} className="transition-colors hover:text-blue-300">
              $RABOTA
            </Link>{' '}
            Enhances Your{' '}
            <Link
              href={SKATECONNECT_URL}
              className="transition-colors hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkateConnect
            </Link>{' '}
            Journey
          </h2>
          <p className="mb-12 text-lg text-gray-400">
            Dive into the{' '}
            <Link
              href={SKATECONNECT_URL}
              className="transition-colors hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkateConnect
            </Link>{' '}
            universe with{' '}
            <Link href={RABOTA_URL} className="transition-colors hover:text-blue-300">
              $RABOTA
            </Link>
            . Unlock exclusive features, connect deeper with the community, and experience
            skateboarding like never before.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Animated Cards */}
            {[
              {
                title: '🎥 Skate Video Rewards',
                description: (
                  <>
                    Share your best skate tricks and earn{' '}
                    <Link href={RABOTA_URL} className="text-blue-400 hover:underline">
                      $RABOTA
                    </Link>
                    . Engage with the SkateConnect community through your videos.
                  </>
                ),
                icon: '🎥',
              },
              {
                title: '📍 Create Skate Spots (Landmarks)',
                description: (
                  <>
                    Use{' '}
                    <Link href={RABOTA_URL} className="text-blue-400 hover:underline">
                      $RABOTA
                    </Link>{' '}
                    to create and share skate spots on{' '}
                    <Link
                      href={SKATECONNECT_URL}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      SkateConnect
                    </Link>
                    . Build your own network of skate locations.
                    <Link href="/spot" className="ml-1 text-blue-400 hover:underline">
                      Create Spots
                    </Link>
                  </>
                ),
                icon: '📍',
              },
              {
                title: '🤖 SkateConnect Bot Power-Ups',
                description: (
                  <>
                    Unlock bot commands for skate spot searches, weather updates for skating, and
                    more within{' '}
                    <Link
                      href={SKATECONNECT_URL}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      SkateConnect
                    </Link>
                    .
                  </>
                ),
                icon: '🤖',
              },
              {
                title: '✅ Verified SkateConnect Status',
                description: (
                  <>
                    Gain credibility within the{' '}
                    <Link
                      href={SKATECONNECT_URL}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      SkateConnect
                    </Link>{' '}
                    community with verified status by holding{' '}
                    <Link href={RABOTA_URL} className="text-blue-400 hover:underline">
                      $RABOTA
                    </Link>
                    .
                  </>
                ),
                icon: '✅',
              },
              {
                title: '💬 SkateConnect Chat Flair',
                description: (
                  <>
                    Show your skate style with unique chat badges and colors in the{' '}
                    <Link
                      href={SKATECONNECT_URL}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      SkateConnect
                    </Link>{' '}
                    community chats.
                  </>
                ),
                icon: '💬',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="transform rounded-xl bg-gray-800 p-8 shadow-lg transition-transform hover:scale-105 hover:bg-gray-700 hover:shadow-2xl"
              >
                <div className="mb-4 text-3xl text-green-400">{item.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-green-300">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
