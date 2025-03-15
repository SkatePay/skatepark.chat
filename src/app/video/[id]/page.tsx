import Footer from '@/app/components/Footer'
import VideoPage from './VideoPage'

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Readonly<Props>) {
  const { id } = await params

  return (
    <>
      <VideoPage id={id} />
      <Footer />
    </>
  )
}
