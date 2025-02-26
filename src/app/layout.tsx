import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Analytics from "@/app/components/Analytics";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SkateConnect – Connect, Chat, and Skate! 🛹",
  description:
    "Join the ultimate skating community with SkateConnect! 🌍 Chat with skaters, plan sessions, rate spots, and compete in skate challenges. Stay connected, ride together! 🚀",
  openGraph: {
    title: "SkateConnect – Connect, Chat, and Skate! 🛹",
    description:
      "Ditch the hassle and ride into the future with SkateConnect! Designed by skaters for skaters, this app lets you chat, plan sessions, rate skate spots, and more! 🏆",
    url: "https://skatepark.chat",
    siteName: "SkateConnect",
    images: [
      {
        url: "https://support.skatepark.chat/~gitbook/image?url=https%3A%2F%2F1319431801-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FVmhjzcujHMsFFxABXiWa%252Fuploads%252Fy9kKpatVRiHMcnyEeLS5%252F512.png%3Falt%3Dmedia%26token%3D50e62822-f5dd-4ed9-862d-d13d783371dc&width=768&dpr=2&quality=100&sign=26181eee&sv=2", // Replace with an actual OG image URL
        width: 1200,
        height: 630,
        alt: "SkateConnect – The App for Skaters",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkateConnect – Connect, Chat, and Skate! 🛹",
    description:
      "SkateConnect is the ultimate platform for skaters to connect, chat, and organize skate sessions. 🏆 Join the movement today!",
    images: [
      "https://support.skatepark.chat/~gitbook/image?url=https%3A%2F%2F1319431801-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FVmhjzcujHMsFFxABXiWa%252Fuploads%252Fy9kKpatVRiHMcnyEeLS5%252F512.png%3Falt%3Dmedia%26token%3D50e62822-f5dd-4ed9-862d-d13d783371dc&width=768&dpr=2&quality=100&sign=26181eee&sv=2",
    ], // Replace with an actual Twitter image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
