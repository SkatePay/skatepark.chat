import Footer from '@/app/components/Footer'
import ChannelPage from './ChannelPage'
import { AboutStructure, Metadata, MetadataContent, Video } from './types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Readonly<Props>) {
  const { id } = await params
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.skatepark.chat'

  const response = await fetch(`${baseUrl}/channel/${id}`)
  const data = await response.json()

  // ✅ Extract and parse metadata
  const metadata: Metadata | undefined = data.meta?.length > 0 ? data.meta[0] : undefined

  let parsedContent: MetadataContent = {}
  let aboutData: AboutStructure | undefined

  if (metadata) {
    try {
      parsedContent = JSON.parse(metadata.content) as MetadataContent
      aboutData =
        typeof parsedContent.about === 'string'
          ? (JSON.parse(parsedContent.about) as AboutStructure)
          : (parsedContent.about ?? undefined)
    } catch (error) {
      console.error('❌ Failed to parse metadata content:', error)
    }
  }

  // ✅ Filter videos with tag "video"
  const filteredVideos: Video[] =
    data.videos?.filter((video: Video) =>
      video.tags?.some((tag) => tag[0] === 't' && tag[1] === 'video')
    ) ?? []

  return (
    <>
      <ChannelPage id={id} videos={filteredVideos} metadata={metadata} about={aboutData} />
      <Footer />
    </>
  )
}
