import Image from "next/image";
import Footer from "./components/Footer";

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
      <Footer />
    </div>
  );
}
