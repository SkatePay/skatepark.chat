'use client'

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js'
// Import SPL Token functions and constants, including specific Error type
import {
  TOKEN_2022_PROGRAM_ID, // Use TOKEN_PROGRAM_ID if $RABOTA is an older SPL token
  TokenAccountNotFoundError,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
} from '@solana/spl-token'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti' // Import confetti
import { Game } from '../types' // Assuming '../types' defines the Game interface { address: string, cost: number, letter: string }

// --- Token Information ($RABOTA) ---
const RABOTA_MINT_ADDRESS = 'E188YbZs6LLVBYav13G227bUnrbj9UJGPshf7E6s6SkG'
const RABOTA_DECIMALS = 0
const RABOTA_TOKEN_PROGRAM_ID = TOKEN_2022_PROGRAM_ID // or TOKEN_PROGRAM_ID
// -----------------------------------

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

// Custom hook to get window dimensions (for confetti)
function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize() // Set initial size
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

/*

Tweet confirmation

Claimed S at Solana Beach Skatepark! #SkateRABOTA”

*/

export const ClaimLetterWithTokenButton = ({ game }: Readonly<Props>) => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, wallet } = useWallet()
  const [network, setNetwork] = useState<SolanaNetwork>('unknown')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false) // <-- New state for success
  const [showConfetti, setShowConfetti] = useState(false) // <-- State to trigger confetti
  const [lastSignature, setLastSignature] = useState<string | null>(null) // Store signature for display
  const [width, height] = useWindowSize() // Get window dimensions

  // --- Network Detection ---
  useEffect(() => {
    const endpoint = connection.rpcEndpoint
    if (endpoint.includes(clusterApiUrl('mainnet-beta')) || endpoint.includes('api.mainnet-beta'))
      setNetwork('mainnet-beta')
    else if (endpoint.includes(clusterApiUrl('testnet')) || endpoint.includes('api.testnet'))
      setNetwork('testnet')
    else if (endpoint.includes(clusterApiUrl('devnet')) || endpoint.includes('api.devnet'))
      setNetwork('devnet')
    else if (endpoint.includes('localhost') || endpoint.includes('127.0.0.1'))
      setNetwork('localnet')
    else setNetwork('unknown')
  }, [connection])

  // --- Recipient Public Key Validation ---
  const recipientPublicKey = useMemo(() => {
    if (!game?.address) return null
    try {
      return new PublicKey(game.address)
    } catch (error) {
      console.error(`Invalid recipient address provided: ${game.address}`, error)
      return null
    }
  }, [game?.address])

  // --- Transfer Logic ---
  const onClick = useCallback(async () => {
    // --- Initial Checks --- (Same as before)
    if (
      !publicKey ||
      !wallet ||
      !recipientPublicKey ||
      game?.cost === undefined ||
      typeof game.cost !== 'number' ||
      game.cost <= 0 ||
      network === 'unknown'
    ) {
      // Simplified error handling as button should be disabled anyway
      toast.error(
        'Cannot proceed. Please ensure wallet is connected, network is detected, and game details are valid.'
      )
      return
    }

    setIsProcessing(true)
    setShowConfetti(false) // Ensure confetti is off initially
    setLastSignature(null) // Reset signature
    const toastId = toast.loading('Preparing $RABOTA transfer...')

    try {
      // --- Token & Account Setup --- (Same as before)
      const mintPublicKey = new PublicKey(RABOTA_MINT_ADDRESS)
      const amountInSmallestUnit = BigInt(Math.round(game.cost * 10 ** RABOTA_DECIMALS))
      const senderAta = getAssociatedTokenAddressSync(
        mintPublicKey,
        publicKey,
        false,
        RABOTA_TOKEN_PROGRAM_ID
      )
      const recipientAta = getAssociatedTokenAddressSync(
        mintPublicKey,
        recipientPublicKey,
        false,
        RABOTA_TOKEN_PROGRAM_ID
      )

      console.log(`Sender Wallet: ${publicKey.toBase58()}`)
      console.log(`Recipient Wallet: ${recipientPublicKey.toBase58()}`)
      console.log(`Sender ATA ($RABOTA): ${senderAta.toBase58()}`)
      console.log(`Recipient ATA ($RABOTA): ${recipientAta.toBase58()}`)
      console.log(`Amount (Smallest Unit): ${amountInSmallestUnit.toString()}`)
      console.log(`Using Token Program ID: ${RABOTA_TOKEN_PROGRAM_ID.toBase58()}`)

      // --- Transaction Assembly --- (Same as before)
      const transaction = new Transaction()
      let accountCreationRequired = false
      try {
        toast.loading('Checking recipient account...', { id: toastId })
        await getAccount(connection, recipientAta, 'confirmed', RABOTA_TOKEN_PROGRAM_ID)
        console.log('Recipient ATA exists.')
      } catch (error: unknown) {
        if (error instanceof TokenAccountNotFoundError) {
          console.log('Recipient ATA does not exist. Adding instruction to create it.')
          accountCreationRequired = true
          transaction.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              recipientAta,
              recipientPublicKey,
              mintPublicKey,
              RABOTA_TOKEN_PROGRAM_ID
            )
          )
        } else {
          console.error('Unexpected error checking recipient ATA:', error)
          let detail = 'An unknown error occurred during account check'
          if (error instanceof Error) detail = error.message
          throw new Error(`Failed to check recipient token account: ${detail}`)
        }
      }

      toast.loading(
        accountCreationRequired ? 'Adding account creation...' : 'Preparing transfer...',
        { id: toastId }
      )

      transaction.add(
        createTransferInstruction(
          senderAta,
          recipientAta,
          publicKey,
          amountInSmallestUnit,
          [],
          RABOTA_TOKEN_PROGRAM_ID
        )
      )

      console.log(
        `Prepared $RABOTA transfer on ${network}: ${game.cost} $RABOTA to recipient ATA ${recipientAta.toBase58()}`
      )

      // --- Blockhash, Sending, Confirmation --- (Same as before)
      toast.loading('Fetching latest blockhash...', { id: toastId })
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext('confirmed')

      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      toast.loading('Sending transaction for approval...', { id: toastId })
      const signature = await sendTransaction(transaction, connection, { minContextSlot })
      setLastSignature(signature) // Store signature immediately
      console.log(`Transaction sent with signature: ${signature}, awaiting confirmation...`)
      toast.loading(`Transaction sent, confirming... (${network})`, { id: toastId })

      const confirmation = await connection.confirmTransaction(
        { blockhash, lastValidBlockHeight, signature },
        'confirmed'
      )

      if (confirmation.value.err) {
        console.error('Transaction Confirmation Error:', confirmation.value.err)
        const errorDetail = JSON.stringify(confirmation.value.err) ?? 'Unknown confirmation error'
        throw new Error(`Transaction failed confirmation: ${errorDetail}`)
      }

      // --- SUCCESS ---
      console.log(`Transaction confirmed: ${signature}`)
      toast.success(`$RABOTA Transfer Successful!`, {
        // Shorter toast
        id: toastId,
        duration: 4000,
      })
      setIsClaimed(true) // Set claim state to true
      setShowConfetti(true) // Trigger confetti
      // Optional: Turn off confetti after a while
      // setTimeout(() => setShowConfetti(false), 6000); // Keep confetti for 6 seconds
    } catch (error: unknown) {
      // --- ERROR HANDLING --- (Same as before)
      console.error('Transaction failed (raw error):', error)
      let message = 'Transaction failed. Please check console or wallet for details.'
      if (error instanceof Error) {
        if (error.message.includes('unable to confirm transaction')) {
          message = 'Transaction timed out or failed to confirm on the network.'
        } else if (error.message.includes('User rejected the request')) {
          message = 'Transaction rejected in wallet.'
        } else {
          message = error.message
        }
      } else if (typeof error === 'string') {
        message = error
      }

      toast.error(`Error: ${message}`, {
        id: toastId,
        duration: 6000,
      })
      // Reset signature if error occurred before sending or during confirmation
      if (!lastSignature || (error instanceof Error && !error.message.includes('User rejected'))) {
        setLastSignature(null)
      }
    } finally {
      setIsProcessing(false) // Stop loading indicator regardless of outcome
    }
  }, [
    publicKey,
    wallet,
    recipientPublicKey,
    game.cost,
    network,
    connection,
    sendTransaction,
    lastSignature,
  ]) // Dependencies remain largely the same

  // --- Button Disabled Logic --- (Same as before, added isClaimed)
  const isDisabled =
    !publicKey ||
    !wallet ||
    network === 'unknown' ||
    !recipientPublicKey ||
    isProcessing ||
    isClaimed || // Disable if already claimed
    game?.cost === undefined ||
    typeof game.cost !== 'number' ||
    game.cost <= 0

  // --- Button Title Logic --- (Added isClaimed case)
  const buttonTitle = getButtonTitle(
    !publicKey,
    !wallet,
    network === 'unknown',
    !recipientPublicKey,
    game?.cost === undefined || typeof game.cost !== 'number' || game.cost <= 0,
    isProcessing,
    isClaimed, // Pass claimed state
    game?.cost,
    network
  )

  // --- Component Rendering ---
  return (
    <div className="relative w-full">
      {/* Render Confetti if showConfetti is true */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false} // Don't recycle particles
          numberOfPieces={500} // More pieces for bigger effect
          tweenDuration={8000} // Longer fall duration
          onConfettiComplete={(confetti) => {
            setShowConfetti(false) // Turn off state when animation completes
            confetti?.reset() // Clean up instance if possible
          }}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }} // Ensure it covers screen
        />
      )}

      {/* Conditionally render Button or Success Message */}
      {!isClaimed ? (
        <button
          onClick={onClick}
          disabled={isDisabled}
          className={`group relative w-full overflow-hidden rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl ${
            isDisabled && !isProcessing // Don't apply gray if only processing, keep gradient
              ? 'cursor-not-allowed bg-gray-400 opacity-70'
              : isProcessing
                ? 'cursor-wait bg-gradient-to-r from-purple-500 to-green-600 opacity-90' // Indicate processing
                : 'bg-gradient-to-r from-purple-500 to-green-600 hover:from-purple-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75'
          }`}
          title={buttonTitle}
        >
          {/* Network Indicator (unchanged) */}
          {network !== 'unknown' &&
            !isProcessing && ( // Hide network when processing for cleaner look
              <span
                className={`absolute right-1 top-1 rounded-full px-2 py-0.5 text-xs font-semibold ${networkIndicatorStyles[network]}`}
              >
                {network.replace('-beta', '')}
              </span>
            )}

          {/* Button Content (unchanged structure, logic handled by isProcessing) */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isProcessing ? (
              <>
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {' '}
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>{' '}
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>{' '}
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Claim Letter With $RABOTA</span>
                <span className="rounded-lg bg-white/20 px-2 py-1 text-sm font-bold backdrop-blur-sm">
                  {game?.letter ?? '?'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {' '}
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />{' '}
                </svg>
              </>
            )}
          </div>

          {/* Cost Display (unchanged) */}
          {!isProcessing && game?.cost !== undefined && game.cost > 0 && (
            <div className="relative z-10 mt-1 text-center text-xs text-white/80 transition-colors duration-300 group-hover:text-white">
              {game.cost} $RAB {/* Assuming RAB is the ticker */}
            </div>
          )}
        </button>
      ) : (
        // --- Success Message ---
        <div className="w-full rounded-xl border border-green-300 bg-green-50 p-4 text-center shadow-md">
          <h3 className="text-lg font-semibold text-green-800">Letter Claimed Successfully!</h3>
          <p className="mt-1 text-sm text-green-700">You have paid {game.cost} $RABOTA.</p>
          {lastSignature && (
            <p className="mt-2 text-xs text-gray-600">
              Tx:
              <a
                // Update explorer link based on network if needed
                href={`https://solscan.io/tx/${lastSignature}?cluster=${network === 'mainnet-beta' ? '' : network}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-blue-600 hover:underline"
                title="View transaction on Solscan"
              >
                {`${lastSignature.substring(0, 6)}...${lastSignature.substring(lastSignature.length - 6)}`}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// --- Helper for Button Title --- (Updated signature)
function getButtonTitle(
  noWallet: boolean,
  noWalletObject: boolean,
  unknownNetwork: boolean,
  invalidRecipient: boolean,
  invalidAmount: boolean,
  processing: boolean,
  isClaimed: boolean, // Added isClaimed
  cost?: number,
  network?: SolanaNetwork
): string {
  if (noWallet) return 'Connect wallet to claim'
  if (noWalletObject) return 'Wallet not available'
  if (unknownNetwork) return 'Determining network...'
  if (invalidRecipient) return 'Invalid recipient address'
  if (invalidAmount) return 'Invalid or missing amount'
  if (processing) return 'Processing transaction...'
  if (isClaimed) return 'Letter already claimed with this button session' // Updated title for claimed state
  return `Claim letter for ${cost ?? '?'} $RABOTA on ${network ?? 'unknown network'}`
}
