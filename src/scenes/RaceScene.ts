import Phaser from 'phaser'

interface SkaterInfo {
  id: number
  name: string
  sprite: string
  dotColor: string
}

interface SkaterState {
  id: number
  sprite: Phaser.Physics.Arcade.Image
  dot: Phaser.GameObjects.Graphics
  icon: Phaser.GameObjects.Text | null
  score: number
  tricks: number
  distance: number
  speed: number
  baseSpeed: number
  angle: number // Used for positioning on the track.
  laps: number
  boostTimer: number
  boostDuration: number
  trickTimer: number
  isTricking: boolean
  trickType: string | null
  crashTimer: number
  isCrashed: boolean
  localSeed: number // For per-skater randomness.
  lapTimes: number[] // Lap times in ms.
  lastLapTimestamp: number // Timestamp when current lap started.
  finishTime?: number // Set when the skater completes 3 laps.
  accumulatedAngle: number // For lap counting.
}

export default class RaceScene extends Phaser.Scene {
  private skaters: SkaterState[] = []
  private headerText!: Phaser.GameObjects.Text
  private scoreboardTexts!: { [key: number]: Phaser.GameObjects.Text }
  private bottomStatusText!: Phaser.GameObjects.Text
  private winLossText!: Phaser.GameObjects.Text | null
  // Log messages appear in the bottom left.
  private logMessages: Phaser.GameObjects.Text[] = []
  private skaterNames!: { [key: number]: string }
  private dotColors!: { [key: number]: string }

  // Global race randomness (32-byte Uint8Array)
  private randomBytes: Uint8Array

  // The selected skater id from registry (the bet placed by "YOU").
  private selectedSkaterId: number | null = null

  // Array of skater ids that received bets (only these will race)
  private betSkaterIds: number[] = []

  // Control flags and variables for countdown and timer.
  private raceStarted = false
  private raceEnded = false
  private raceStartTime = 0

  // Reference to UI text objects.
  private countdownText!: Phaser.GameObjects.Text
  private raceTimerText!: Phaser.GameObjects.Text

  // Flag to flash first-lap message only once.
  private firstLapFlashed = false

  constructor() {
    super({ key: 'RaceScene' })
  }

  preload(): void {
    this.load.image('skater1', '/assets/skater1.png')
    this.load.image('skater2', '/assets/skater2.png')
    this.load.image('skater3', '/assets/skater3.png')
    this.load.image('skater4', '/assets/skater4.png')
  }

  create(): void {
    const centerX = 400
    const centerY = 300

    // Draw the track.
    this.cameras.main.setBackgroundColor('#808080')
    const trackGraphics = this.add.graphics()
    trackGraphics.lineStyle(4, 0xffffff)
    trackGraphics.strokeEllipse(centerX, centerY, 480, 240)

    // --- Mark starting positions on the track ---
    // For each bet-selected skater, compute the starting position using
    // the same angle calculation used later (angle = 90 * (id - 1)).
    // We use half of the track dimensions.
    this.betSkaterIds = this.registry.get('betSkaterIds') || [1, 2, 3, 4]
    this.dotColors = this.registry
      .get('skaterInfo')
      .reduce((acc: { [key: number]: string }, sk: SkaterInfo) => {
        acc[sk.id] = sk.dotColor
        return acc
      }, {})
    this.betSkaterIds.forEach((id) => {
      // Calculate starting angle for the skater.
      const startAngle = 90 * (id - 1)
      const rad = Phaser.Math.DegToRad(startAngle)
      const markerX = centerX + (480 / 2) * Math.cos(rad)
      const markerY = centerY + (240 / 2) * Math.sin(rad)
      // Draw a static marker (a slightly larger circle)
      const marker = this.add.graphics()
      marker.fillStyle(parseInt(this.dotColors[id].slice(1), 16), 1)
      marker.fillCircle(markerX, markerY, 6)
    })

    // Retrieve skater info.
    const skaterInfo: SkaterInfo[] = this.registry.get('skaterInfo')
    if (!skaterInfo) {
      throw new Error('skaterInfo not found in registry')
    }
    this.skaterNames = {}
    this.dotColors = {}
    skaterInfo.forEach((sk) => {
      this.skaterNames[sk.id] = sk.name
      this.dotColors[sk.id] = sk.dotColor
    })

    // Retrieve global race randomness.
    const storedBytes = this.registry.get('raceRandomness') as Uint8Array
    if (!storedBytes || storedBytes.length !== 32) {
      throw new Error('raceRandomness not found or invalid in registry')
    }
    this.randomBytes = storedBytes
    console.log('Loaded raceRandomness:', this.randomBytes)

    // Retrieve bet-related info.
    this.selectedSkaterId = this.registry.get('selectedSkater') || null
    if (!this.betSkaterIds || this.betSkaterIds.length === 0) {
      // Fallback: if no bets recorded, race all 4.
      this.betSkaterIds = [1, 2, 3, 4]
    }

    // Initialize skater states only for bet-selected skaters.
    const baseSeed =
      ((this.randomBytes[0] << 24) |
        (this.randomBytes[1] << 16) |
        (this.randomBytes[2] << 8) |
        this.randomBytes[3]) >>>
      0
    const offsetConstant = 1234567
    const now = this.time.now
    this.skaters = []
    this.betSkaterIds.forEach((id) => {
      const localSeed = (baseSeed + id * offsetConstant) >>> 0
      const skater: SkaterState = {
        id,
        sprite: null!,
        dot: null!,
        icon: null,
        score: 0,
        tricks: 0,
        distance: 0,
        speed: 2,
        baseSpeed: 2,
        angle: 90 * (id - 1),
        laps: 0,
        boostTimer: 0,
        boostDuration: 0,
        trickTimer: 0,
        isTricking: false,
        trickType: null,
        crashTimer: 0,
        isCrashed: false,
        localSeed,
        lapTimes: [],
        lastLapTimestamp: now,
        accumulatedAngle: 0,
      }
      this.skaters.push(skater)
    })

    // Create skater sprites and dots.
    this.skaters.forEach((skater) => {
      skater.sprite = this.physics.add.image(centerX, centerY, `skater${skater.id}`).setScale(1)
      // Mirror the asset for clockwise movement.
      skater.sprite.setFlipX(true)
      skater.dot = this.add.graphics()
      skater.dot.fillStyle(parseInt(this.dotColors[skater.id].slice(1), 16), 1)
      skater.dot.fillCircle(0, 0, 4)
      skater.dot.setPosition(skater.sprite.x, skater.sprite.y - 40)
    })

    // Create scoreboard header.
    this.headerText = this.add
      .text(
        400,
        50,
        'Name'.padEnd(12, ' ') +
          'Lap1 (s)'.padEnd(10, ' ') +
          'Lap2 (s)'.padEnd(10, ' ') +
          'Lap3 (s)'.padEnd(10, ' ') +
          'Score'.padEnd(8, ' '),
        { font: '16px Courier', color: '#ffffff' }
      )
      .setOrigin(0.5)

    // Create scoreboard rows.
    this.scoreboardTexts = {}
    this.skaters.forEach((skater, index) => {
      const row = this.add
        .text(400, 70 + index * 20, '', { font: '16px Courier', color: this.dotColors[skater.id] })
        .setOrigin(0.5)
      this.scoreboardTexts[skater.id] = row
    })

    // Create bottom center status text.
    this.bottomStatusText = this.add
      .text(400, 550, 'Racing...', { font: '24px Arial', color: '#ff0' })
      .setOrigin(0.5)

    this.winLossText = null

    // Create race timer text.
    this.raceTimerText = this.add.text(640, 20, '00:00:000', {
      font: '20px Courier',
      color: '#ffffff',
      backgroundColor: '#000',
      padding: { top: 4, bottom: 4, left: 8, right: 8 },
    })

    // Start the retro countdown.
    this.startCountdown()
  }

  // ------------------------------------------------------------------
  // startCountdown: Displays "3…", "2…", "1…", "GO!" then starts the race.
  // ------------------------------------------------------------------
  private startCountdown(): void {
    const centerX = 400
    const centerY = 300
    const countdownNumbers = ['3', '2', '1', 'GO!']
    let countIndex = 0

    this.countdownText = this.add.text(centerX, centerY, '', {
      font: '64px Courier',
      color: '#ff0',
      stroke: '#000',
      strokeThickness: 6,
    })
    this.countdownText.setOrigin(0.5)

    const countdownEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.countdownText.setText(countdownNumbers[countIndex])
        countIndex++
        if (countIndex === countdownNumbers.length) {
          this.time.delayedCall(500, () => {
            this.countdownText.destroy()
            this.raceStarted = true
            this.raceStartTime = this.time.now
          })
          countdownEvent.remove(false)
        }
      },
      loop: true,
    })
  }

  // ------------------------------------------------------------------
  // nextSkaterRandomFloat: LCG returning a float in [0,1).
  // ------------------------------------------------------------------
  private nextSkaterRandomFloat(skater: SkaterState): number {
    const a = 1664525
    const c = 1013904223
    const m = 4294967296
    skater.localSeed = (a * skater.localSeed + c) >>> 0
    return skater.localSeed / m
  }

  update(time: number, delta: number): void {
    if (!this.raceStarted || this.raceEnded) return

    // --- Update Race Timer ---
    const elapsed = time - this.raceStartTime
    const minutes = Math.floor(elapsed / 60000)
    const seconds = Math.floor((elapsed % 60000) / 1000)
    const milliseconds = elapsed % 1000
    this.raceTimerText.setText(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`
    )

    const trackWidth = 480
    const trackHeight = 240
    const centerX = 400
    const centerY = 300
    const deltaSeconds = delta / 1000
    const trickOptions = ['Kickflip', 'Ollie', 'Grind']

    this.skaters.forEach((skater) => {
      if (skater.finishTime !== undefined) return

      // --- BOOST LOGIC (frequency doubled) ---
      skater.boostTimer -= deltaSeconds
      if (skater.boostTimer <= 0 && !skater.isTricking && !skater.isCrashed) {
        if (this.nextSkaterRandomFloat(skater) < 0.8) {
          skater.boostDuration = 3
          skater.speed = skater.baseSpeed * 2
          this.addLogMessage(`${this.skaterNames[skater.id]} Boost!`, this.dotColors[skater.id])
          if (skater.icon) skater.icon.destroy()
          skater.icon = this.add.text(skater.sprite.x + 10, skater.sprite.y - 40, '💪🏻', {
            font: '12px Arial',
            color: this.dotColors[skater.id],
          })
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              if (skater.icon) {
                skater.icon.destroy()
                skater.icon = null
              }
            },
          })
        }
        skater.boostTimer = 5 + this.nextSkaterRandomFloat(skater) * 5
      }
      if (skater.boostDuration > 0) {
        skater.boostDuration -= deltaSeconds
        if (skater.boostDuration <= 0) {
          skater.speed = skater.baseSpeed
        }
      }

      // --- TRICK LOGIC (frequency doubled) ---
      skater.trickTimer -= deltaSeconds
      if (
        skater.trickTimer <= 0 &&
        !skater.isTricking &&
        !skater.isCrashed &&
        skater.boostDuration <= 0
      ) {
        if (this.nextSkaterRandomFloat(skater) < 0.6) {
          skater.isTricking = true
          skater.trickType =
            trickOptions[Math.floor(this.nextSkaterRandomFloat(skater) * trickOptions.length)]
          this.addLogMessage(
            `${this.skaterNames[skater.id]} attempts ${skater.trickType}!`,
            this.dotColors[skater.id]
          )
          if (skater.icon) skater.icon.destroy()
          // Immediately show the skateboard emoji.
          skater.icon = this.add.text(skater.sprite.x + 10, skater.sprite.y - 40, '🛹', {
            font: '12px Arial',
            color: this.dotColors[skater.id],
          })
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              if (skater.isTricking) {
                skater.isTricking = false
                const failed = this.nextSkaterRandomFloat(skater) < 0.25
                if (failed) {
                  skater.isCrashed = true
                  skater.crashTimer = 3
                  skater.speed = skater.baseSpeed * 0.5
                  this.addLogMessage(
                    `${this.skaterNames[skater.id]} Failed!`,
                    this.dotColors[skater.id]
                  )
                  if (skater.icon) skater.icon.destroy()
                  skater.icon = this.add.text(skater.sprite.x + 10, skater.sprite.y - 40, '❌', {
                    font: '12px Arial',
                    color: this.dotColors[skater.id],
                  })
                } else {
                  skater.tricks += 1
                  this.addLogMessage(
                    `${this.skaterNames[skater.id]} Success!`,
                    this.dotColors[skater.id]
                  )
                  if (skater.icon) skater.icon.destroy()
                  skater.icon = this.add.text(skater.sprite.x + 10, skater.sprite.y - 40, '✅', {
                    font: '12px Arial',
                    color: this.dotColors[skater.id],
                  })
                  this.updateScoreboard()
                }
                this.time.addEvent({
                  delay: 1000,
                  callback: () => {
                    if (skater.icon) {
                      skater.icon.destroy()
                      skater.icon = null
                    }
                  },
                })
              }
            },
          })
        }
        skater.trickTimer = 8 + this.nextSkaterRandomFloat(skater) * 4
      }

      // --- CRASH TIMER ---
      if (skater.crashTimer > 0) {
        skater.crashTimer -= deltaSeconds
        if (skater.crashTimer <= 0) {
          skater.isCrashed = false
          skater.speed = skater.baseSpeed
        }
      }

      // --- MOVEMENT & LAP TRACKING ---
      // Reverse direction for clockwise movement: add deltaAngle.
      let effectiveSpeed = skater.speed
      if (!skater.isTricking) {
        effectiveSpeed *= 8
      }
      const deltaAngle = effectiveSpeed * deltaSeconds
      skater.accumulatedAngle += deltaAngle
      if (skater.accumulatedAngle >= 360) {
        const lapDuration = time - skater.lastLapTimestamp
        skater.lapTimes.push(lapDuration)
        skater.lastLapTimestamp = time
        skater.laps += 1
        skater.accumulatedAngle -= 360
      }
      if (skater.lapTimes.length >= 3 && skater.finishTime === undefined) {
        skater.finishTime = time
        skater.sprite?.destroy()
        skater.dot?.destroy()
        if (skater.icon) {
          skater.icon.destroy()
          skater.icon = null
        }
      }
      if (skater.finishTime === undefined) {
        // Reverse direction: add deltaAngle.
        skater.angle += deltaAngle
        const avgRadius = (trackWidth + trackHeight) / 4
        const distancePerDegree = (2 * Math.PI * avgRadius) / 360
        skater.distance += effectiveSpeed * deltaSeconds * distancePerDegree
        const rad = Phaser.Math.DegToRad(skater.angle)
        if (skater.sprite && skater.sprite.active) {
          skater.sprite.x = centerX + (trackWidth / 2) * Math.cos(rad)
          skater.sprite.y = centerY + (trackHeight / 2) * Math.sin(rad)
        }
      }
      if (skater.sprite && skater.sprite.active && skater.dot) {
        skater.dot.setPosition(skater.sprite.x, skater.sprite.y - 40)
      }
      if (skater.icon) {
        skater.icon.setPosition(skater.sprite.x + 10, skater.sprite.y - 40)
      }
      let normalizedAngle = skater.angle % 360
      if (normalizedAngle < 0) normalizedAngle += 360
      if (normalizedAngle > 180 && normalizedAngle < 360) {
        skater.sprite && skater.sprite.setScale(1, 1)
      } else {
        skater.sprite && skater.sprite.setScale(-1, 1)
      }
    })

    // --- Check for first lap completion flash ---
    if (!this.firstLapFlashed && this.skaters.every((s) => s.laps >= 1)) {
      this.firstLapFlashed = true
      const flashText = this.add
        .text(400, 300, '🌐 SkateConnect 🛹', {
          font: '32px Arial',
          color: '#fff',
          stroke: '#000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
      this.tweens.add({
        targets: flashText,
        alpha: { from: 1, to: 0 },
        duration: 2000,
        onComplete: () => {
          flashText.destroy()
        },
      })
    }

    this.updateScoreboard()

    // --- CHECK RACE FINISH ---
    const allFinished = this.skaters.every((sk) => sk.finishTime !== undefined)
    if (allFinished) {
      this.raceEnded = true

      const bonusPerLap: { [lapIndex: number]: { [id: number]: number } } = {}
      for (let lapIndex = 0; lapIndex < 3; lapIndex++) {
        let lapArray: { id: number; time: number }[] = []
        this.skaters.forEach((skater) => {
          if (skater.lapTimes[lapIndex] !== undefined) {
            lapArray.push({ id: skater.id, time: skater.lapTimes[lapIndex] })
          }
        })
        lapArray.sort((a, b) => a.time - b.time)
        bonusPerLap[lapIndex] = {}
        const lapBonuses = [3, 2, 1, 0]
        lapArray.forEach((entry, idx) => {
          bonusPerLap[lapIndex][entry.id] = lapBonuses[idx] || 0
        })
      }
      this.skaters.forEach((skater) => {
        const baseScore = skater.tricks + Math.floor(skater.distance / 100)
        const lapBonus =
          (bonusPerLap[0][skater.id] || 0) +
          (bonusPerLap[1][skater.id] || 0) +
          (bonusPerLap[2][skater.id] || 0)
        skater.score = baseScore + lapBonus
      })
      const winnerSkater = this.skaters.reduce((prev, curr) =>
        prev.score > curr.score ? prev : curr
      )
      const winnerName = this.skaterNames[winnerSkater.id]
      this.bottomStatusText.setText(`Winner: ${winnerName}!`)
      this.addLogMessage(`Winner: ${winnerName}!`, '#ff0')

      if (this.selectedSkaterId !== null) {
        const isWin = this.selectedSkaterId === winnerSkater.id
        const winLossMessage = isWin ? 'You Won!' : 'You Lost!'
        const winLossColor = isWin ? '#00ff00' : '#ff0000'
        this.winLossText = this.add
          .text(400, 520, winLossMessage, { font: '24px Arial', color: winLossColor })
          .setOrigin(0.5)
        this.addLogMessage(winLossMessage, winLossColor)
      }
      this.showRestartButton()
    }
  }

  // ------------------------------------------------------------------
  // showRestartButton: Displays a "Restart" button.
  // ------------------------------------------------------------------
  private showRestartButton(): void {
    const button = this.add
      .text(780, 580, 'Restart', {
        font: '32px Arial',
        color: '#00ff00',
        backgroundColor: '#333333',
      })
      .setOrigin(1, 1)
      .setInteractive()
    button.on('pointerdown', () => {
      this.clearRaceState()
      this.scene.start('SelectionScene')
    })
  }

  // ------------------------------------------------------------------
  // updateScoreboard: Updates the scoreboard rows.
  // ------------------------------------------------------------------
  private updateScoreboard(): void {
    this.skaters.forEach((skater) => {
      if (skater.finishTime === undefined) {
        skater.score = skater.tricks + Math.floor(skater.distance / 100)
      }
    })
    this.skaters.forEach((skater) => {
      let name = this.skaterNames[skater.id]
      if (this.selectedSkaterId === skater.id) {
        name += ' 💰'
      }
      const lap1 = skater.lapTimes[0] !== undefined ? (skater.lapTimes[0] / 1000).toFixed(2) : '--'
      const lap2 = skater.lapTimes[1] !== undefined ? (skater.lapTimes[1] / 1000).toFixed(2) : '--'
      const lap3 = skater.lapTimes[2] !== undefined ? (skater.lapTimes[2] / 1000).toFixed(2) : '--'
      const rowText =
        `${name.padEnd(12, ' ')}` +
        `${lap1.padEnd(10, ' ')}` +
        `${lap2.padEnd(10, ' ')}` +
        `${lap3.padEnd(10, ' ')}` +
        `${String(skater.score).padEnd(8, ' ')}`
      this.scoreboardTexts[skater.id].setText(rowText)
    })

    const sortedSkaters = this.skaters.slice().sort((a, b) => {
      if (b.score === a.score) return a.id - b.id
      return b.score - a.score
    })
    sortedSkaters.forEach((skater, idx) => {
      this.scoreboardTexts[skater.id].setPosition(400, 70 + idx * 20)
    })
  }

  // ------------------------------------------------------------------
  // addLogMessage: Displays a temporary log message.
  // ------------------------------------------------------------------
  private addLogMessage(message: string, color: string = '#fff'): void {
    const baseY = 480
    const yPos = baseY + this.logMessages.length * 20
    const text = this.add.text(20, yPos, message, { font: '14px Arial', color })
    this.logMessages.push(text)
    this.tweens.add({
      targets: text,
      alpha: 0,
      duration: 1000,
      delay: 2000,
      onComplete: () => {
        text.destroy()
        this.logMessages = this.logMessages.filter((msg) => msg !== text)
        this.logMessages.forEach((msg, index) => {
          msg.setY(baseY + index * 20)
        })
      },
    })
    if (this.logMessages.length > 5) {
      const oldest = this.logMessages.shift()
      if (oldest) oldest.destroy()
      this.logMessages.forEach((msg, index) => {
        msg.setY(baseY + index * 20)
      })
    }
  }

  // ------------------------------------------------------------------
  // clearRaceState: Clears all UI objects and resets local state.
  // ------------------------------------------------------------------
  private clearRaceState(): void {
    this.skaters.forEach((skater) => {
      if (skater.sprite) skater.sprite.destroy()
      if (skater.dot) skater.dot.destroy()
      if (skater.icon) skater.icon.destroy()
    })
    this.skaters = []
    Object.values(this.scoreboardTexts).forEach((txt) => txt.destroy())
    this.scoreboardTexts = {}
    if (this.headerText) this.headerText.destroy()
    this.logMessages.forEach((msg) => msg.destroy())
    this.logMessages = []
    if (this.bottomStatusText) this.bottomStatusText.destroy()
    if (this.winLossText) this.winLossText.destroy()

    // Reset race control flags.
    this.raceStarted = false
    this.raceEnded = false
    this.raceStartTime = 0
    this.firstLapFlashed = false
  }
}
