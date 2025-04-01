'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js' // Import PublicKey
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Game } from '../types'
import toast from 'react-hot-toast' // Assuming you use react-hot-toast for better alerts

type SolanaNetwork = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet' | 'unknown'

interface Props {
  game: Game
}

// Helper map for network indicator styles
const networkIndicatorStyles: Record<SolanaNetwork, string> = {
  'mainnet-beta': 'bg-red-600 text-white',
  testnet: 'bg-yellow-500 text-black',
  devnet: 'bg-blue-500 text-white',
  localnet: 'bg-gray-600 text-white',
  unknown: 'bg-gray-400 text-black',
}

export const ClaimLetterWithSolButton = ({ game }: Readonly<Props>) => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet() // Added wallet for potential logging/debugging
  const [network, setNetwork] = useState<SolanaNetwork>('unknown')
  const [isProcessing, setIsProcessing] = useState(false) // State for loading indicator

  useEffect(() => {
    const endpoint = connection.rpcEndpoint
    if (endpoint.includes(clusterApiUrl('mainnet-beta')) || endpoint.includes('api.mainnet-beta')) {
      setNetwork('mainnet-beta')
    } else if (endpoint.includes(clusterApiUrl('testnet')) || endpoint.includes('api.testnet')) {
      setNetwork('testnet')
    } else if (endpoint.includes(clusterApiUrl('devnet')) || endpoint.includes('api.devnet')) {
      setNetwork('devnet')
    } else if (endpoint.includes('localhost') || endpoint.includes('127.0.0.1')) {
      setNetwork('localnet')
    } else {
      setNetwork('unknown')
    }
  }, [connection])

  const recipientPublicKey = useMemo(() => {
    if (!game?.address) {
      console.error('Recipient address is missing in game prop.')
      return null // Return null if address is missing
    }
    try {
      // Convert the string address from game prop to PublicKey
      return new PublicKey(game.address)
    } catch (error) {
      console.error(`Invalid recipient address provided: ${game.address}`, error)
      toast.error(`Invalid recipient address: ${game.address}`)
      return null // Return null if the address is invalid
    }
  }, [game?.address]) // Depend on game.address

  const onClick = useCallback(async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first.')
      // Trigger wallet connect modal if available and desired
      // wallet?.adapter.connect().catch(() => {}); // Example: attempt to connect
      return
    }
    if (!recipientPublicKey) {
      toast.error('Recipient address is invalid or missing.')
      return
    }
    if (network === 'unknown') {
      toast.error('Cannot determine network. Please wait or refresh.')
      return
    }
    // Optional: Add specific network checks if needed
    // if (network !== 'devnet') {
    //   toast.error(`This action is only available on Devnet, but you are on ${network}.`);
    //   return;
    // }

    setIsProcessing(true) // Start loading indicator
    const toastId = toast.loading('Processing transaction...')

    try {
      const lamports = await connection.getMinimumBalanceForRentExemption(0)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports,
        })
      )

      console.log(
        `Preparing transaction on ${network} to send ${lamports} lamports from ${publicKey.toBase58()} to ${recipientPublicKey.toBase58()}`
      )

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext('finalized') // Use finalized for more certainty

      const signature = await sendTransaction(transaction, connection, { minContextSlot })
      console.log(`Transaction sent with signature: ${signature}, awaiting confirmation...`)
      toast.loading(`Transaction sent, awaiting confirmation... (${network})`, { id: toastId })

      const confirmation = await connection.confirmTransaction(
        { blockhash, lastValidBlockHeight, signature },
        'confirmed'
      ) // Use 'confirmed' or 'finalized'

      if (confirmation.value.err) {
        throw new Error(
          `Transaction failed confirmation: ${JSON.stringify(confirmation.value.err)}`
        )
      }

      console.log(`Transaction confirmed: ${signature}`)
      toast.success(`Transaction Successful! Signature: ${signature.substring(0, 8)}...`, {
        id: toastId,
      })
    } catch (error: unknown) {
      // <--- Use unknown type
      console.error('Transaction failed (raw error):', error) // Log the raw error object for debugging

      // Determine the error message safely
      let message = 'Transaction failed. Please try again.' // Default message
      if (error instanceof Error) {
        message = error.message

        // Optional: Check for specific error types you might anticipate
        // For example, from @solana/wallet-adapter-base:
        // if (error instanceof WalletSendTransactionError) {
        //   // Can provide more specific feedback
        // }
        // Or based on error name/code if available from Solana RPC errors
        // if (error.name === '...') { ... }
      } else if (typeof error === 'string') {
        // If a plain string was thrown
        message = error
      } else if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        // Handle cases where it's an object with a message property but not an Error instance
        message = error.message
      }

      toast.error(`Error: ${message}`, { id: toastId })
    } finally {
      setIsProcessing(false) // Stop loading indicator
    }
  }, [publicKey, sendTransaction, connection, network, recipientPublicKey]) // Added wallet

  const isDisabled = !publicKey || network === 'unknown' || !recipientPublicKey || isProcessing

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`group relative w-full overflow-hidden rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl ${
        isDisabled
          ? 'cursor-not-allowed bg-gray-400 opacity-70'
          : 'bg-gradient-to-r from-purple-500 to-green-600 hover:from-purple-600 hover:to-green-700' // Added hover gradient change
      }`}
      title={
        !publicKey
          ? 'Connect wallet to claim'
          : network === 'unknown'
            ? 'Determining network...'
            : !recipientPublicKey
              ? 'Invalid recipient address'
              : isProcessing
                ? 'Processing...'
                : `Claim Letter (${network})`
      }
    >
      {network !== 'unknown' && (
        <span
          className={`absolute right-1 top-1 rounded-full px-2 py-0.5 text-xs font-semibold ${networkIndicatorStyles[network]}`}
        >
          {network.replace('-beta', '')}
        </span>
      )}

      <div className="relative z-10 flex items-center justify-center gap-2">
        {isProcessing ? (
          <>
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Claim Letter With SOL</span>
            <span className="rounded-lg bg-white/20 px-2 py-1 text-sm font-bold backdrop-blur-sm">
              {game.letter}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </>
        )}
      </div>
      {!isProcessing && (
        <div className="relative z-10 mt-1 text-center text-xs text-white/80 transition-colors duration-300 group-hover:text-white">
          {game.cost} SOL
        </div>
      )}
    </button>
  )
}
