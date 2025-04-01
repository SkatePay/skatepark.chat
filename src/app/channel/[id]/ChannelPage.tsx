'use client'

import Link from 'next/link'
import Image from 'next/image'
import QRCodeGenerator from './components/QRCodeGenerator'
import { AboutStructure, ContentStructure, Game, MetadataContent, NostrEvent } from './types'
import { ClipboardIcon, FlagIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic' // Import dynamic

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false } // Important: disable server-side rendering
)

import { clusterApiUrl } from '@solana/web3.js'

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css'
import { useMemo } from 'react'
import { ClaimLetterWithTokenButton } from './components/ClaimLetterWithTokenButton'

interface Props {
  id: string
  videos: NostrEvent[]
  games: NostrEvent[]
  metadata?: MetadataContent
  about?: AboutStructure
}

const friendlyKey = (npub: string) => {
  const npubString = String(npub || '')
  const suffix = npubString.slice(-3)
  return `Skater-${suffix}`
}

export default function ChannelPage({ id, videos, games, metadata, about }: Readonly<Props>) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Testnet

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new UnsafeBurnerWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  )

  const channelName = metadata ? metadata.name : `Channel #${id}`
  const channelOwner = metadata?.pubkey ? friendlyKey(metadata.pubkey) : undefined

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const formatCoordinate = (coord: number | undefined) => {
    if (coord === undefined) return 'N/A'
    return coord.toFixed(6)
  }

  const content = games[0]?.content
  const contentStructure: ContentStructure = content ? JSON.parse(content) : null
  const game = contentStructure ? (JSON.parse(contentStructure.text) as Game) : null

  const page = (
    <div className="font-geist min-h-screen text-gray-800 dark:text-gray-200">
      <div className="container mx-auto max-w-3xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/chat/${id}`} className="text-blue-600 hover:underline dark:text-blue-400">
              💬
            </Link>
            <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
              SkateConnect
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{channelName}</span>
            <button
              onClick={() => handleCopy(id)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ClipboardIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {/* Publish Spot Button */}
          <Link href="/spot">
            <button className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="relative z-10 flex items-center justify-center gap-2">
                <FlagIcon className="h-5 w-5" />
                <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                  Publish Your Spot
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </Link>
        </div>

        {/* Claim Letter Button */}
        {game && (
          <div className="flex flex-col items-center gap-4 p-4">
            {/* <ClaimLetterWithSolButton game={game} /> */}
            <ClaimLetterWithTokenButton game={game} />
            <WalletMultiButton />
          </div>
        )}

        {/* Metadata */}
        {about && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-gray-700">
            {about.location && (
              <p className="mb-2">
                📍 <strong>Location:</strong> {formatCoordinate(about.location.latitude)},{' '}
                {formatCoordinate(about.location.longitude)}
              </p>
            )}
            {about.description && (
              <p className="mb-2">
                📜 <strong>Description:</strong> {about.description}
              </p>
            )}
            {about.note && (
              <p className="mb-2">
                📝 <strong>Note:</strong> {about.note}
              </p>
            )}
            {channelOwner && (
              <p className="mb-2">
                🛹 <strong>Founder:</strong>{' '}
                <Link href="/spot" className="text-blue-600 hover:underline dark:text-blue-400">
                  {channelOwner}
                </Link>
              </p>
            )}
          </div>
        )}

        {/* QR Code */}
        <div className="mb-8">
          <QRCodeGenerator />
        </div>

        {/* Video Section */}
        {videos.length === 0 ? (
          <div className="py-10 text-center">No videos found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              let videoUrl
              try {
                videoUrl = JSON.parse(video.content).content
              } catch (error) {
                console.error(error, video.content)
                return null
              }

              const videoId = videoUrl.split('/').pop()?.replace('.mov', '')
              const thumbnailUrl = `https://skateconnect.s3.us-west-2.amazonaws.com/${videoId}.jpg`

              return (
                <div key={video.id} className="overflow-hidden rounded-lg shadow-md">
                  <Link href={`/video/${videoId}`}>
                    <div className="relative w-full">
                      <Image
                        src={thumbnailUrl}
                        alt="Video thumbnail"
                        width={320}
                        height={180}
                        className="h-auto w-full cursor-pointer object-cover transition-transform duration-200"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.style.display = 'none'
                          const fallback = img.nextSibling as HTMLDivElement
                          fallback.style.display = 'flex'
                        }}
                      />
                      <div className="hidden h-[320px] w-[180px] items-center justify-center bg-[#eee] text-sm text-[#555]">
                        🏁 No thumbnail
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{page}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
