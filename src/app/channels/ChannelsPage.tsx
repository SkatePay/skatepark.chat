'use client'

import Footer from '../components/Footer'
import { Spot } from './types'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  spots: Spot[]
}

export default function ChannelPage({ spots }: Readonly<Props>) {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex w-full max-w-6xl flex-col gap-12">
        <header className="text-center sm:text-left">
          <h1 className="text-4xl font-bold sm:text-5xl">🛹 Skate Spots 🌎</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {spots.length} locations to explore
          </p>
        </header>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Link href="/">
              <button className="transform rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                ← Back Home
              </button>
            </Link>

            <Link href="/spot">
              <button className="transform rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-teal-600">
                Add New Spot
              </button>
            </Link>
          </div>

          <a
            className="flex items-center justify-center transition-opacity hover:opacity-75"
            href="https://apps.apple.com/us/app/skateconnect/id6677058833"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on the App Store"
              width={150}
              height={50}
              priority
            />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{spot.icon}</span>
                  <h2 className="text-xl font-semibold dark:text-white">{spot.name}</h2>
                </div>

                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>Lat: {spot.coordinate.latitude.toFixed(4)}</span>
                  <span className="mx-2">|</span>
                  <span>Lng: {spot.coordinate.longitude.toFixed(4)}</span>
                </div>

                {spot.note && (
                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">{spot.note}</p>
                )}

                <div className="flex flex-wrap gap-3">
                  {spot.channelId && (
                    <Link
                      href={`/channel/${spot.channelId}`}
                      className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Visit Spot
                    </Link>
                  )}

                  <a
                    href={`https://www.google.com/maps?q=${spot.coordinate.latitude},${spot.coordinate.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    View Map
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
