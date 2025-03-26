import Image from 'next/image'
import Footer from './components/Footer'
import Link from 'next/link'

export default function Home() {
  const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1 className="text-center text-4xl font-bold sm:text-left sm:text-5xl">
          🌐 SkateConnect 🛹
        </h1>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
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
          <a
            className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://support.skatepark.chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Publish your Spot Button */}
          <Link href="/spot">
            <button className="transform rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-teal-600">
              Publish your Spot
            </button>
          </Link>

          {/* Browse Spots Button */}
          <Link href={`/channel/${channelId}`}>
            <button className="transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700">
              HQ
            </button>
          </Link>

          {/* New Channels Button */}
          <Link href="/channels">
            <button className="transform rounded-full bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-700">
              Famous Spots 📹
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
