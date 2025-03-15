export default function Footer() {
  const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID

  return (
    <footer className="row-start-3 flex flex-col items-center justify-center gap-2 text-center">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={`/chat/${channelId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          👀 Channels
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={`/channel/${channelId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Videos 📹
        </a>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} SkateConnect. All rights reserved.
      </p>
    </footer>
  )
}
