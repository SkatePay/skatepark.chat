import Footer from '@/app/components/Footer'
import ChannelPage from './ChannelPage'
import { AboutStructure, MetadataContent, NostrEvent } from './types'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Readonly<Props>) {
  const { id } = await params
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.skatepark.chat'

  const response = await fetch(`${baseUrl}/channel/${id}`)
  const data = await response.json()

  // ✅ Extract and parse metadata
  const metadata: MetadataContent | undefined = data.metadata

  let aboutData: AboutStructure | undefined

  if (metadata) {
    try {
      aboutData =
        typeof metadata.about === 'string'
          ? (JSON.parse(metadata.about) as AboutStructure)
          : (metadata.about ?? undefined)
    } catch (error) {
      console.error('❌ Failed to parse metadata content:', error)
    }
  } else {
    redirect('/')
  }

  const games: NostrEvent[] = data.games ?? []

  // ✅ Filter videos with tag "video"
  const videos: NostrEvent[] =
    data.videos?.filter((video: NostrEvent) =>
      video.tags?.some((tag) => tag[0] === 't' && tag[1] === 'video')
    ) ?? []

  return (
    <>
      <ChannelPage id={id} videos={videos} games={games} metadata={metadata} about={aboutData} />
      <Footer />
    </>
  )
}
