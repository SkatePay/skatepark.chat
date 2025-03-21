import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// POST /api/spots → Notify hub that there is a spot creation request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    if (!body.skateConnectId || !body.channelId) {
      return NextResponse.json(
        { error: 'Invalid request: skateConnectId and channelId are required' },
        { status: 400 }
      )
    }

    // Construct the payload to send to the hub API
    const hubPayload = {
      type: 'skateSpotSubmission',
      skateConnectId: body.skateConnectId,
      channelId: body.channelId,
      description: body.description || '',
      solanaAddress: body.solanaAddress || '',
      instagram: body.instagram || '',
      reddit: body.reddit || '',
      x: body.x || '',
      tiktok: body.tiktok || '',
      telegram: body.telegram || '',
    }

    // Send a POST request to the hub API
    const response = await axios.post(`${process.env.HUB_API_URL}/notify`, hubPayload)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error sending spot data to hub API:', error)
    return NextResponse.json({ error: 'Failed to process spot submission' }, { status: 500 })
  }
}
