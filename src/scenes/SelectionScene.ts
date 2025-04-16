import Phaser from 'phaser'

// Consolidated skater data interface and constant
interface SkaterInfo {
  id: number
  name: string
  sprite: string
  dotColor: string // Hex color for the dot
}

const skaterData: SkaterInfo[] = [
  { id: 1, name: 'Ace', sprite: 'skater1', dotColor: '#FF0000' },
  { id: 2, name: 'Blaze', sprite: 'skater2', dotColor: '#0000FF' },
  { id: 3, name: 'Cruz', sprite: 'skater3', dotColor: '#00FF00' },
  { id: 4, name: 'Dash', sprite: 'skater4', dotColor: '#FFFF00' },
]

// Interfaces for our mock Solana "GameManager"
interface MockBet {
  player: string
  skaterId: number
  amount: number
}

interface MockGame {
  id: number
  title: string
  isFinalized: boolean
  bets: MockBet[]
  txSignatures: string[]
  fixedSeed?: Uint8Array // For games using a fixed seed
  finalSeedHex?: string // Once finalized, store the seed (as hex)
}

interface MockTransaction {
  signature: string
  slot: number
  blockTime: number
  instructions: string
}

export default class SelectionScene extends Phaser.Scene {
  private mockGames: MockGame[] = []
  private mockTransactions: MockTransaction[] = []

  // A container to hold the UI elements for a selected game's details.
  private gameDetailContainer!: Phaser.GameObjects.Container

  private selectedGameId: number | null = null

  constructor() {
    super({ key: 'SelectionScene' })
  }

  preload(): void {
    // Load skater sprites
    this.load.image('skater1', '/assets/skater1.png')
    this.load.image('skater2', '/assets/skater2.png')
    this.load.image('skater3', '/assets/skater3.png')
    this.load.image('skater4', '/assets/skater4.png')
  }

  create(): void {
    // ---------------------------------------------------------
    // 1) Store consolidated skater data in the registry.
    //    (If RaceScene needs names/dot colors, it can derive them.)
    // ---------------------------------------------------------
    // For simplicity, we store an object mapping id to name.
    const skaterNames: { [key: number]: string } = {}
    skaterData.forEach((sk) => {
      skaterNames[sk.id] = sk.name
    })
    this.registry.set('skaterNames', skaterNames)
    // Optionally, store the full array:
    this.registry.set('skaterInfo', skaterData)

    // ---------------------------------------------------------
    // 2) Initialize mock game data
    // ---------------------------------------------------------
    const gameA: MockGame = {
      id: 101,
      title: 'Game A (0 Bets)',
      isFinalized: false,
      bets: [],
      txSignatures: [],
    }
    const gameB: MockGame = {
      id: 102,
      title: 'Game B (1 Bet)',
      isFinalized: false,
      bets: [{ player: 'Alice', skaterId: 1, amount: 2 }],
      txSignatures: [],
    }
    const gameC: MockGame = {
      id: 103,
      title: 'Game C (2 Bets, random seed)',
      isFinalized: false,
      bets: [
        { player: 'Bob', skaterId: 2, amount: 2 },
        { player: 'Cindy', skaterId: 3, amount: 2 },
      ],
      txSignatures: [],
    }

    // Create three additional games that will use fixed seeds for debugging.
    // For variety, we use different fixed seeds here.
    const fixedSeedA = new Uint8Array(32).fill(0x41) // All 'A'
    const fixedSeedB = new Uint8Array(32).fill(0x42) // All 'B'
    const fixedSeedC = new Uint8Array(32).fill(0x43) // All 'C'
    const gameD: MockGame = {
      id: 104,
      title: 'Game D (0 Bets, fixed A seed)',
      isFinalized: false,
      bets: [],
      txSignatures: [],
      fixedSeed: fixedSeedA,
    }
    const gameE: MockGame = {
      id: 105,
      title: 'Game E (1 Bet, fixed B seed)',
      isFinalized: false,
      bets: [{ player: 'Derek', skaterId: 1, amount: 2 }],
      txSignatures: [],
      fixedSeed: fixedSeedB,
    }
    const gameF: MockGame = {
      id: 106,
      title: 'Game F (2 Bets, fixed C seed)',
      isFinalized: false,
      bets: [
        { player: 'Erin', skaterId: 4, amount: 2 },
        { player: 'Frank', skaterId: 3, amount: 2 },
      ],
      txSignatures: [],
      fixedSeed: fixedSeedC,
    }

    this.mockGames = [gameA, gameB, gameC, gameD, gameE, gameF]
    this.mockTransactions = []

    // ---------------------------------------------------------
    // 3) UI Setup: Scene title and container for details.
    // ---------------------------------------------------------
    this.add
      .text(400, 30, 'Racetrack Manager (6 Games)', {
        font: '24px Arial',
        color: '#ffffff',
      })
      .setOrigin(0.5)

    // Create container for game details.
    this.gameDetailContainer = this.add.container(0, 0)

    // ---------------------------------------------------------
    // 4) Display the list of games (lobby)
    // ---------------------------------------------------------
    let startY = 80
    this.mockGames.forEach((game, index) => {
      this.add
        .text(40, startY + index * 30, `${game.title} - (ID: ${game.id})`, {
          font: '16px Arial',
          color: '#ffff00',
        })
        .setInteractive()
        .on('pointerdown', () => {
          this.selectedGameId = game.id
          this.showGameDetails(game)
        })
    })
  }

  // ------------------------------------------------------------------
  // showGameDetails: Displays details for a selected game.
  // ------------------------------------------------------------------
  private showGameDetails(game: MockGame): void {
    // Clear old details.
    this.gameDetailContainer.removeAll(true)

    let detailX = 350
    let detailY = 100

    // Title and game status.
    const titleText = this.make.text({
      x: detailX,
      y: detailY,
      text: `Selected Game: ${game.title}`,
      style: { font: '18px Arial', color: '#0f0' },
    })
    this.gameDetailContainer.add(titleText)
    detailY += 30

    const statusStr = game.isFinalized ? 'FINALIZED' : 'OPEN for Bets'
    const statusColor = game.isFinalized ? '#ff8080' : '#ffffff'
    const statusText = this.make.text({
      x: detailX,
      y: detailY,
      text: `Status: ${statusStr}`,
      style: { font: '16px Arial', color: statusColor },
    })
    this.gameDetailContainer.add(statusText)
    detailY += 30

    // If finalized, show the seed.
    if (game.isFinalized && game.finalSeedHex) {
      const seedText = this.make.text({
        x: detailX,
        y: detailY,
        text: `Seed: ${game.finalSeedHex}`,
        style: { font: '14px Arial', color: '#ffff00' },
      })
      this.gameDetailContainer.add(seedText)
      detailY += 20
    }

    // Bets summary.
    const betsHeader = this.make.text({
      x: detailX,
      y: detailY,
      text: `Bets: ${game.bets.length}`,
      style: { font: '16px Arial', color: '#ffffff' },
    })
    this.gameDetailContainer.add(betsHeader)
    detailY += 20

    if (game.bets.length === 0) {
      const noBetsText = this.make.text({
        x: detailX + 20,
        y: detailY,
        text: '(No Bets)',
        style: { font: '14px Arial', color: '#999999' },
      })
      this.gameDetailContainer.add(noBetsText)
      detailY += 20
    } else {
      game.bets.forEach((bet) => {
        const betLine = this.make.text({
          x: detailX + 20,
          y: detailY,
          text: `- ${bet.player} bet ${bet.amount} on Skater #${bet.skaterId}`,
          style: { font: '14px Arial', color: '#dddddd' },
        })
        this.gameDetailContainer.add(betLine)
        detailY += 20
      })
    }
    detailY += 10

    // Transaction signatures.
    const txHeader = this.make.text({
      x: detailX,
      y: detailY,
      text: 'Tx Signatures:',
      style: { font: '16px Arial', color: '#ffffff' },
    })
    this.gameDetailContainer.add(txHeader)
    detailY += 20

    if (game.txSignatures.length === 0) {
      const noTxText = this.make.text({
        x: detailX + 20,
        y: detailY,
        text: '(No Transactions)',
        style: { font: '14px Arial', color: '#999999' },
      })
      this.gameDetailContainer.add(noTxText)
      detailY += 20
    } else {
      game.txSignatures.forEach((sig) => {
        const sigText = this.make.text({
          x: detailX + 20,
          y: detailY,
          text: sig,
          style: { font: '14px Arial', color: '#00ffff' },
        })
        sigText.setInteractive().on('pointerdown', () => {
          this.showTransactionDetails(sig)
        })
        this.gameDetailContainer.add(sigText)
        detailY += 20
      })
    }
    detailY += 10

    // Show options.
    if (!game.isFinalized) {
      const betLabel = this.make.text({
        x: detailX,
        y: detailY,
        text: 'Place a New Bet:',
        style: { font: '16px Arial', color: '#00ff00' },
      })
      this.gameDetailContainer.add(betLabel)
      detailY += 30

      skaterData.forEach((sk) => {
        const icon = this.add
          .image(detailX, detailY + 50, sk.sprite)
          .setScale(0.8)
          .setInteractive()
          .on('pointerdown', () => {
            this.placeMockBet(game.id, sk.id)
          })
        icon.x = detailX + 40 + (sk.id - 1) * 80
        this.gameDetailContainer.add(icon)

        const iconLabel = this.make.text({
          x: icon.x,
          y: icon.y + 30,
          text: sk.name,
          style: { font: '12px Arial', color: '#ffffff' },
        })
        iconLabel.setOrigin(0.5)
        this.gameDetailContainer.add(iconLabel)
      })

      detailY += 100

      const finalizeBtn = this.make.text({
        x: detailX,
        y: detailY,
        text: '[Finalize Game]',
        style: { font: '16px Arial', color: '#ffff00', backgroundColor: '#333333' },
      })
      finalizeBtn.setInteractive().on('pointerdown', () => {
        this.finalizeGame(game.id)
      })
      this.gameDetailContainer.add(finalizeBtn)
    } else {
      const startBtn = this.make.text({
        x: detailX,
        y: detailY,
        text: '[Start Race]',
        style: { font: '16px Arial', color: '#00ff00', backgroundColor: '#333333' },
      })
      startBtn.setInteractive().on('pointerdown', () => {
        this.startRace(game.id)
      })
      this.gameDetailContainer.add(startBtn)
    }
  }

  // ------------------------------------------------------------------
  // placeMockBet: Simulates placing a bet on a game.
  // ------------------------------------------------------------------
  private placeMockBet(gameId: number, skaterId: number): void {
    const game = this.mockGames.find((g) => g.id === gameId)
    if (!game) return
    if (game.isFinalized) {
      alert('Game is already finalized; cannot bet.')
      return
    }

    game.bets.push({ player: 'YOU', skaterId, amount: 2 })
    this.registry.set('selectedSkater', skaterId)

    const signature = this.generateMockSignature()
    const slot = Math.floor(Math.random() * 50000) + 100000
    const blockTime = Math.floor(Date.now() / 1000)
    const instructions = `placeBet(gameId=${gameId}, skaterId=${skaterId}, amount=2)`
    this.mockTransactions.push({ signature, slot, blockTime, instructions })
    game.txSignatures.push(signature)

    this.showGameDetails(game)
  }

  // ------------------------------------------------------------------
  // finalizeGame: Marks the game as finalized and sets the final seed.
  // Also computes the unique skater IDs that received bets.
  // ------------------------------------------------------------------
  private finalizeGame(gameId: number): void {
    const game = this.mockGames.find((g) => g.id === gameId)
    if (!game) return
    if (game.isFinalized) {
      alert('Already finalized.')
      return
    }
    if (game.bets.length < 2) {
      alert('Need at least 2 bets to finalize!')
      return
    }

    game.isFinalized = true

    const signature = this.generateMockSignature()
    const slot = Math.floor(Math.random() * 50000) + 100000
    const blockTime = Math.floor(Date.now() / 1000)
    const instructions = `finalizeGame(gameId=${gameId}) => produce raceRandomness`
    this.mockTransactions.push({ signature, slot, blockTime, instructions })
    game.txSignatures.push(signature)

    let finalSeed: Uint8Array
    if (game.fixedSeed) {
      finalSeed = game.fixedSeed
    } else {
      finalSeed = new Uint8Array(32)
      window.crypto.getRandomValues(finalSeed)
    }

    const finalSeedHex = this.toHexString(finalSeed)
    game.finalSeedHex = finalSeedHex

    this.registry.set('raceRandomness', finalSeed)
    this.registry.set('gameId', gameId)

    // Store unique bet skater IDs.
    const betSkaterIds = Array.from(new Set(game.bets.map((bet) => bet.skaterId)))
    this.registry.set('betSkaterIds', betSkaterIds)

    // Removed the alert popup here.
    this.showGameDetails(game)
  }

  // ------------------------------------------------------------------
  // startRace: Transition to the RaceScene.
  // ------------------------------------------------------------------
  private startRace(gameId: number): void {
    console.log(`Starting race for gameId=${gameId}...`)
    this.scene.start('RaceScene')
  }

  // ------------------------------------------------------------------
  // showTransactionDetails: Display transaction details.
  // ------------------------------------------------------------------
  private showTransactionDetails(signature: string): void {
    const tx = this.mockTransactions.find((t) => t.signature === signature)
    if (!tx) {
      alert('Transaction not found: ' + signature)
      return
    }
    const blockTimeStr = new Date(tx.blockTime * 1000).toLocaleString()
    alert(
      `Signature: ${tx.signature}\nSlot: ${tx.slot}\nBlockTime: ${blockTimeStr}\nInstructions: ${tx.instructions}`
    )
  }

  // ------------------------------------------------------------------
  // generateMockSignature: Produces a pseudo-base58 signature string.
  // ------------------------------------------------------------------
  private generateMockSignature(): string {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    let sig = ''
    for (let i = 0; i < 44; i++) {
      sig += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return sig
  }

  // ------------------------------------------------------------------
  // toHexString: Converts a Uint8Array to an uppercase hex string.
  // ------------------------------------------------------------------
  private toHexString(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  }
}
