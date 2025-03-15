export interface Video {
  id: string
  content: string
  tags?: [string, string][]
}

export interface Metadata {
  kind: number
  id: string
  pubkey: string
  created_at: number
  tags: [string, string][]
  content: string // JSON-encoded metadata
  sig: string
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
}
