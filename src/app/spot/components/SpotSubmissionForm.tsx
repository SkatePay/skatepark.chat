'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link' // Import Link

// Helper function to validate Solana addresses (basic check)
const isValidSolanaAddress = (address: string) => {
  return typeof address === 'string' && address.length >= 32 // Basic check
}

// Helper function to validate Nostr public keys (basic check)
const isValidNostrPublicKey = (key: string) => {
  return typeof key === 'string' && key.startsWith('npub') // Basic check
}

// Define the URLs as constants
const SKATECONNECT_URL =
  process.env.NEXT_PUBLIC_DOWNLOAD_URL ?? 'https://apps.apple.com/us/app/skateconnect/id6677058833'
const RABOTA_URL =
  process.env.NEXT_RABOTA_URL ??
  'https://prorobot.ai/token/DaEivka37g83C3QMokZmBsUNsAHoh1tm8HhKh8r4Cen5'

const SpotSubmissionForm = () => {
  const [skateConnectId, setSkateConnectId] = useState('')
  const [channelId, setChannelId] = useState('')
  const [solanaAddress, setSolanaAddress] = useState('')
  const [description, setDescription] = useState('')
  const [instagram, setInstagram] = useState('')
  const [reddit, setReddit] = useState('')
  const [x, setX] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [telegram, setTelegram] = useState('')
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | 'loading' | null>(
    null
  )
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmissionStatus('loading')
      setErrorMessage('')

      // Client-side validation
      if (!isValidNostrPublicKey(skateConnectId)) {
        setSubmissionStatus('error')
        setErrorMessage('Invalid SkateConnect ID (Nostr public key).')
        return
      }
      if (!channelId) {
        setSubmissionStatus('error')
        setErrorMessage('Channel ID is required.')
        return
      }
      if (!solanaAddress || !isValidSolanaAddress(solanaAddress)) {
        setSubmissionStatus('error')
        setErrorMessage('Invalid Solana address.')
        return
      }

      try {
        const response = await fetch('/api/spots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            skateConnectId,
            channelId,
            solanaAddress,
            description,
            instagram,
            reddit,
            x,
            tiktok,
            telegram,
          }),
        })

        if (response.ok) {
          console.log('Spot submitted successfully!')
          setSubmissionStatus('success')
          setSkateConnectId('')
          setChannelId('')
          setSolanaAddress('')
          setDescription('')
          setInstagram('')
          setReddit('')
          setX('')
          setTiktok('')
          setTelegram('')
        } else {
          const errorData = await response.json()
          console.error('Failed to submit spot:', response.statusText, errorData)
          setSubmissionStatus('error')
          setErrorMessage(errorData.error || 'An unexpected error occurred.')
          return
        }
      } catch (error) {
        console.error('Error submitting spot:', error)
        setSubmissionStatus('error')
        setErrorMessage('Failed to connect to the server. Please try again.')
      }
    },
    [skateConnectId, channelId, solanaAddress, description, instagram, reddit, x, tiktok, telegram]
  )

  return (
    <div className="w-full max-w-2xl">
      <h1 className="mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-center text-3xl font-bold text-transparent drop-shadow-lg md:mb-8 md:text-4xl">
        Submit a Skate Spot 🛹
      </h1>

      <p className="mb-4 text-center text-sm text-gray-400 md:mb-6 md:text-base">
        Share your favorite skate spots with the{' '}
        <Link
          href={SKATECONNECT_URL}
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          SkateConnect
        </Link>{' '}
        community and earn{' '}
        <Link
          href={RABOTA_URL}
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          $RABOTA
        </Link>{' '}
        rewards.
      </p>

      {submissionStatus === 'success' && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
          Spot submitted successfully!
        </div>
      )}

      {submissionStatus === 'error' && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to submit spot. {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="skateConnectId" className="block text-sm font-medium text-gray-300">
            SkateConnect ID (Nostr npub key)
          </label>
          <input
            type="text"
            id="skateConnectId"
            value={skateConnectId}
            onChange={(e) => setSkateConnectId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            placeholder="npub1..."
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Your unique ID from the{' '}
            <Link
              href={SKATECONNECT_URL}
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkateConnect
            </Link>{' '}
            app. This is generated when you create your account.
          </p>
        </div>

        <div>
          <label htmlFor="channelId" className="block text-sm font-medium text-gray-300">
            Channel ID
          </label>
          <input
            type="text"
            id="channelId"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            placeholder="Channel ID obtained after mapping the spot"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            The unique ID obtained after you have mapped the skate spot within the{' '}
            <Link
              href={SKATECONNECT_URL}
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkateConnect
            </Link>{' '}
            app.
          </p>
        </div>

        <div>
          <label htmlFor="solanaAddress" className="block text-sm font-medium text-gray-300">
            Solana Address
          </label>
          <input
            type="text"
            id="solanaAddress"
            value={solanaAddress}
            onChange={(e) => setSolanaAddress(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            placeholder="Your Solana wallet address"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            If your spot is approved and added to the public list, the{' '}
            <Link
              href={RABOTA_URL}
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              $RABOTA
            </Link>{' '}
            reward will be sent to this address.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            placeholder="Describe the spot..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Social Accounts (Optional)
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Instagram"
              className="block w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="text"
              value={reddit}
              onChange={(e) => setReddit(e.target.value)}
              placeholder="Reddit"
              className="block w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="text"
              value={x}
              onChange={(e) => setX(e.target.value)}
              placeholder="X (Twitter)"
              className="block w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="TikTok"
              className="block w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="Telegram"
              className="block w-full rounded-md border border-gray-700 bg-gray-800 px-3 text-white shadow-sm transition-colors duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            disabled={submissionStatus === 'loading'}
          >
            {submissionStatus === 'loading' ? 'Submitting...' : 'Submit Spot for Reward'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SpotSubmissionForm
