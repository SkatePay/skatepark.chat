'use client'

import Footer from '@/app/components/Footer'
import dynamic from 'next/dynamic'
import Head from 'next/head'

// Load Game component client-side only
const Game = dynamic(() => import('@/app/components/Game'), {
  ssr: false, // Disable SSR
})

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-gray-900 to-black p-4 text-white md:p-8">
      <Head>
        <title>SkateConnect - Racetrack</title>
        <meta
          name="description"
          content="Publish your skate spot to SkateConnect and earn rewards."
        />
      </Head>
      <br />
      <Game />

      <Footer />
    </div>
  )
}
