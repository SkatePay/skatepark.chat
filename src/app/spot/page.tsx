import Footer from '@/app/components/Footer'
import SpotSubmissionForm from './components/SpotSubmissionForm'
import Head from 'next/head'

interface PageProps {
  searchParams: Promise<{
    npub?: string
    spot_id?: string
  }>
}

export default async function Page({ searchParams }: Readonly<PageProps>) {
  const { npub, spot_id } = await searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-gray-900 to-black p-4 text-white md:p-8">
      <Head>
        <title>Publish your Skate Spot - SkateConnect</title>
        <meta
          name="description"
          content="Publish your skate spot to SkateConnect and earn rewards."
        />
      </Head>
      <SpotSubmissionForm npub={npub} spotId={spot_id} />
      <br />
      <Footer />
    </div>
  )
}
