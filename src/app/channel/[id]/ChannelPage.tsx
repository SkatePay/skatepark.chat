'use client'

import Link from 'next/link'
import Image from 'next/image'
import QRCodeGenerator from './components/QRCodeGenerator'
import { AboutStructure, MetadataContent } from './types'
import { ClipboardIcon, FlagIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface Video {
  id: string
  content: string
}

interface Props {
  id: string
  videos: Video[]
  metadata?: MetadataContent
  about?: AboutStructure
}

export default function ChannelPage({ id, videos, metadata, about }: Readonly<Props>) {
  const channelName = metadata ? metadata.name : `Channel #${id}`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const formatCoordinate = (coord: number | undefined) => {
    if (coord === undefined) return 'N/A'
    return coord.toFixed(6)
  }

  return (
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

        {/* Publish Spot Button */}
        <div className="mb-8 text-center">
          <Link href="/spot">
            <button className="mx-auto flex items-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <FlagIcon className="mr-2 h-6 w-6" />
              Publish Your Spot
            </button>
          </Link>
        </div>

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
}
