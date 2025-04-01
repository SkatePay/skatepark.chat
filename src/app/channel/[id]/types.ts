export interface NostrEvent {
  id: string
  content: string
  tags?: [string, string][]
}

export interface ContentStructure {
  kind: string
  metadata: string
  text: string
}

export interface Game {
  letter: string
  cost: number
  address: string
}

export interface AboutStructure {
  location?: {
    longitude: number
    latitude: number
  }
  description?: string
  note?: string
}

export interface MetadataContent {
  name?: string
  relays?: string[]
  about?: AboutStructure | string // Sometimes `about` might be a raw string
  picture?: string
  pubkey?: string
}
