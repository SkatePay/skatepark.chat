export interface Spot {
  id: string
  name: string
  icon: string
  note: string
  coordinate: {
    latitude: number
    longitude: number
  }
  channelId: string
}
