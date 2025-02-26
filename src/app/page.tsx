import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-center sm:text-left text-4xl sm:text-5xl font-bold">
          🌐 SkateConnect 🛹
        </h1>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="flex items-center justify-center transition-opacity hover:opacity-75"
            href="https://apps.apple.com/us/app/skateconnect/id6677058833"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on the App Store"
              width={150} // Adjust size if needed
              height={50}
              priority
            />
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://support.skatepark.chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex flex-col gap-2 items-center justify-center text-center">
        <div className="flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="chat/548e9b382e79eb49562c50fb6a49b58da38da4ebe4ba67d3be5caadb6536fc3e"
            target="_blank"
            rel="noopener noreferrer"
          >
            👀 Channels
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="channel/92ef3ac79a8772ddf16a2e74e239a67bc95caebdb5bd59191c95cf91685dfc8e"
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
    </div>
  );
}
