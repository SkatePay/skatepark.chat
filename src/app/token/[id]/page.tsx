import Footer from '@/app/components/Footer'
import TokenPage from '../components/TokenPage'

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Readonly<Props>) {
  const { id } = await params

  return (
    <>
      <TokenPage id={id} />
      <Footer />
    </>
  )
}
