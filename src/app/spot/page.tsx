import Footer from '@/app/components/Footer'
import SpotSubmissionForm from './components/SpotSubmissionForm'
import Head from 'next/head'

export default async function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-gray-900 to-black p-4 text-white md:p-8">
      <Head>
        <title>Publish your Skate Spot - SkateConnect</title>
        <meta
          name="description"
          content="Publish your skate spot to SkateConnect and earn rewards."
        />
      </Head>
      <SpotSubmissionForm />
      <br />
      <Footer />
    </div>
  )
}
