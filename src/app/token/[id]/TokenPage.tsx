'use client'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  id: string
}

export default function TokenPerksPage({ id }: Readonly<Props>) {
  return (
    <div style={styles.container}>
      {/* Inject structured data for SEO (optional) */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Token Perks',
              description:
                'Discover the benefits of using $RABOTA token for seamless transactions and exclusive rewards.',
            }),
          }}
        />
      </Head>

      {/* Banner at the top */}
      <div style={styles.banner}>
        <p>🚀 Unlock exclusive perks with our token! Learn more below.</p>
      </div>

      <h1>
        <Link
          href={`https://prorobot.ai/token/${id}`}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          $RABOTA
        </Link>{' '}
        Token Perks
      </h1>

      {/* Screenshots Section */}
      <div style={styles.screenshotsContainer}>
        <h2>Why Use Our Token?</h2>
        <p>
          Our token provides exclusive benefits such as discounted transactions, priority access to
          events, and more. Check out these screenshots showcasing seamless transactions:
        </p>
        <div style={styles.screenshotGrid}>
          <div style={styles.screenshot}>
            <Image
              src="/images/bank.png"
              alt="Payment Request Flow"
              width={500}
              height={300}
              style={styles.image}
            />
            <p>Fast and secure transactions with minimal fees.</p>
          </div>
          <div style={styles.screenshot}>
            <Image
              src="/images/wallet.png"
              alt="Wallet Preview"
              width={500}
              height={300}
              style={styles.image}
            />
            <p>Earn rewards for every transaction you make.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  banner: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    textAlign: 'center' as const,
    width: '100%',
    marginBottom: '20px',
  },
  screenshotsContainer: {
    textAlign: 'center' as const,
    maxWidth: '1000px',
    margin: '0 auto',
  },
  screenshotGrid: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    marginTop: '20px',
    flexWrap: 'wrap' as const, // Ensures responsiveness on smaller screens
  },
  screenshot: {
    flex: 1,
    maxWidth: '500px',
  },
  image: {
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}
