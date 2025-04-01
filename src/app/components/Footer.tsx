import Link from 'next/link'
// Import icons from react-icons (using Font Awesome 6 set as an example)
import { FaYoutube, FaReddit, FaInstagram, FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  const youtubeChannelUrl =
    process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL ?? 'https://www.youtube.com/@SkateConnect' // Consider a better fallback or making it mandatory

  // Define social URLs (use environment variables for flexibility)
  const redditUrl = process.env.NEXT_PUBLIC_REDDIT_URL ?? 'https://www.reddit.com/r/SkateConnect/' // Replace '#' with your Reddit URL or env var
  const instagramUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/skateconnect.app/' // Replace '#' with your Instagram URL or env var
  const xUrl = process.env.NEXT_PUBLIC_X_URL ?? 'https://x.com/skatepay' // Replace '#' with your X/Twitter URL or env var

  return (
    <footer className="row-start-3 flex flex-col items-center justify-center gap-4 py-6 text-center">
      {' '}
      {/* Added padding and increased gap */}
      {/* Links Section */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {' '}
        {/* Adjusted gaps */}
        {/* Social Links */}
        <a
          href={youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-red-600 hover:underline hover:underline-offset-4"
          aria-label="SkateConnect on YouTube" // Accessibility improvement
        >
          <FaYoutube className="h-5 w-5" /> {/* YouTube Icon */}
        </a>
        <a
          href={redditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-orange-500 hover:underline hover:underline-offset-4"
          aria-label="SkateConnect on Reddit"
        >
          <FaReddit className="h-5 w-5" /> {/* Reddit Icon */}
        </a>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-pink-600 hover:underline hover:underline-offset-4"
          aria-label="SkateConnect on Instagram"
        >
          <FaInstagram className="h-5 w-5" /> {/* Instagram Icon */}
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-gray-700 hover:underline hover:underline-offset-4 dark:hover:text-gray-300"
          aria-label="SkateConnect on X"
        >
          <FaXTwitter className="h-5 w-5" /> {/* X (Twitter) Icon */}
        </a>
        {/* Internal/App Links */}
        <a
          className="flex items-center gap-2 hover:text-gray-700 hover:underline hover:underline-offset-4 dark:hover:text-gray-300"
          href={`/token/DaEivka37g83C3QMokZmBsUNsAHoh1tm8HhKh8r4Cen5`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔶 Earn
        </a>
      </div>
      {/* Copyright Section */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} <Link href="/">SkateConnect</Link>. All rights reserved.
      </p>
    </footer>
  )
}
