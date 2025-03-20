'use client'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  id: string
}

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
                name: 'Token Perks - $RABOTA on SkateConnect',
                description:
                  'Discover how $RABOTA tokens enhance your SkateConnect experience. Unlock exclusive features, earn rewards, and connect with the skateboarding community.',
              }),
            }}
          />
        </Head>

        {/* Dynamic Banner with SkateConnect Link */}
        <div className="mb-8 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-teal-600 py-4 text-center text-white shadow-md transition-transform hover:scale-105">
          <p className="mr-2 text-lg font-semibold tracking-wide">
            🛹 Power Up Your SkateConnect Experience with $RABOTA! ⚡
          </p>
          <Link href="/" className="text-sm text-blue-300 hover:underline">
            Back to SkateConnect
          </Link>
        </div>

        <h1 className="mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-5xl font-extrabold text-transparent">
          <Link
            href={`https://prorobot.ai/token/${id}`}
            className="transition-colors hover:text-blue-300"
          >
            $RABOTA
          </Link>{' '}
          Token: Your Key to SkateConnect
        </h1>

        {/* Token Utility Section with Animated Cards */}
        <div className="mx-auto w-full max-w-6xl text-center">
          <h2 className="mb-6 text-4xl font-semibold text-gray-200">
            Why $RABOTA Enhances Your SkateConnect Journey
          </h2>
          <p className="mb-12 text-lg text-gray-400">
            Dive into the SkateConnect universe with $RABOTA. Unlock exclusive features, connect
            deeper with the community, and experience skateboarding like never before.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Animated Cards */}
            {[
              {
                title: '🎥 Skate Video Rewards',
                description:
                  'Share your best skate tricks and earn $RABOTA. Engage with the SkateConnect community through your videos.',
                icon: '🎥',
              },
              {
                title: '📍 Create Skate Spots (Landmarks)',
                description:
                  'Use $RABOTA to create and share skate spots on SkateConnect. Build your own network of skate locations.',
                icon: '📍',
              },
              {
                title: '🤖 SkateConnect Bot Power-Ups',
                description:
                  'Unlock bot commands for skate spot searches, weather updates for skating, and more within SkateConnect.',
                icon: '🤖',
              },
              {
                title: '✅ Verified SkateConnect Status',
                description:
                  'Gain credibility within the SkateConnect community with verified status by holding $RABOTA.',
                icon: '✅',
              },
              {
                title: '💬 SkateConnect Chat Flair',
                description:
                  'Show your skate style with unique chat badges and colors in the SkateConnect community chats.',
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
            See $RABOTA in Action on SkateConnect
          </h2>
          <p className="mb-10 text-lg text-gray-400">
            Explore how $RABOTA enhances your experience within the SkateConnect platform.
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
              <p className="mt-3 text-gray-400">Secure $RABOTA transactions within SkateConnect.</p>
            </div>
            <div className="max-w-md transform transition-transform hover:scale-105">
              <Image
                src="/images/wallet.png"
                alt="Wallet Preview for SkateConnect"
                width={500}
                height={300}
                className="w-full rounded-2xl shadow-xl"
              />
              <p className="mt-3 text-gray-400">Earn $RABOTA rewards on SkateConnect.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
