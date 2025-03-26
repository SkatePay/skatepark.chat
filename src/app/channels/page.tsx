import ChannelsPage from './ChannelsPage'
import { Spot } from './types'

export default async function SpotsPage() {
  try {
    // For Server Components, use the full internal URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3002'

    const response = await fetch(`${baseUrl}/api/spots`, {
      next: { revalidate: 60 }, // Optional: Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch spots: ${response.statusText}`)
    }

    const spots: Spot[] = await response.json()
    return <ChannelsPage spots={spots} />
  } catch (error) {
    console.error('Error fetching spots:', error)
    return <div className="p-4 text-red-500">Failed to load spots. Please try again later.</div>
  }
}
