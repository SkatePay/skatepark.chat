'use client'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  id: string
}

// Define the URLs as constants
const SKATECONNECT_URL =
  process.env.NEXT_PUBLIC_DOWNLOAD_URL ?? 'https://apps.apple.com/us/app/skateconnect/id6677058833'
const RABOTA_URL =
  process.env.NEXT_RABOTA_URL ??
  'https://prorobot.ai/token/DaEivka37g83C3QMokZmBsUNsAHoh1tm8HhKh8r4Cen5'

export default function TokenPerksPage({ id }: Readonly<Props>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black p-8 text-white">
      {/* Animated Background Particles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute h-full w-full animate-pulse opacity-20">
          <div className="absolute left-1/4 top-1/4 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-sm"></div>
          <div className="absolute right-1/4 top-3/4 h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 blur-sm"></div>
          <div className="absolute bottom-1/4 left-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 blur-sm"></div>
        </div>
      </div>

      <div className="relative z-10">
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
        <div className="mb-8 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-teal-600 py-4 text-center text-white shadow-md transition-transform hover:scale-105">
          <p className="mr-2 text-lg font-semibold tracking-wide">
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

        {/* Screenshots Section with Parallax Effect */}
        <div className="mx-auto mt-20 w-full max-w-6xl text-center">
          <h2 className="mb-6 text-4xl font-semibold text-gray-200">
            See{' '}
            <Link href={RABOTA_URL} className="text-blue-400 hover:underline">
              $RABOTA
            </Link>{' '}
            in Action on{' '}
            <Link
              href={SKATECONNECT_URL}
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkateConnect
            </Link>
          </h2>
          <p className="mb-10 text-lg text-gray-400">
            Explore how{' '}
            <Link href={RABOTA_URL} className="text-blue-400 hover:underline">
              $RABOTA
            </Link>{' '}
            enhances your experience within the{' '}
            <Link
              href={SKATECONNECT_URL}
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkateConnect
            </Link>{' '}
            platform.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-md transform transition-transform hover:scale-105">
              <Image
                src="/images/bank.png"
                alt="Payment Request Flow on SkateConnect"
                width={500}
                height={300}
                className="w-full rounded-2xl shadow-xl"
              />
              <p className="mt-3 text-gray-400">
                Secure{' '}
                <Link href={RABOTA_URL} className="text-blue-400 hover:underline">
                  $RABOTA
                </Link>{' '}
                transactions within{' '}
                <Link
                  href={SKATECONNECT_URL}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SkateConnect
                </Link>
                .
              </p>
            </div>
            <div className="max-w-md transform transition-transform hover:scale-105">
              <Image
                src="/images/wallet.png"
                alt="Wallet Preview for SkateConnect"
                width={500}
                height={300}
                className="w-full rounded-2xl shadow-xl"
              />
              <p className="mt-3 text-gray-400">
                Earn{' '}
                <Link href={RABOTA_URL} className="text-blue-400 hover:underline">
                  $RABOTA
                </Link>{' '}
                rewards on{' '}
                <Link
                  href={SKATECONNECT_URL}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SkateConnect
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
