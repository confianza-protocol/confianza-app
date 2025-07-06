import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import TrustBadge from '@/components/ui/TrustBadge'

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container-main">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left animate-in">
                <h1 className="heading-1 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Safe P2P crypto</span>{' '}
                  <span className="block text-primary xl:inline">trading for LATAM</span>
                </h1>
                <p className="mt-3 body-large sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0 text-text-secondary">
                  Build trust through on-chain reputation. Trade with confidence knowing every user has a visible trust score based on their trading history.
                </p>
                
                {/* Trust Score Preview */}
                <Card className="mt-8 max-w-md" padding="md">
                  <h3 className="heading-4 mb-4">Trust Score System</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="body-small">Unverified</span>
                      <TrustBadge tier="unverified" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="body-small">Bronze</span>
                      <TrustBadge tier="bronze" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="body-small">Silver</span>
                      <TrustBadge tier="silver" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="body-small">Gold</span>
                      <TrustBadge tier="gold" />
                    </div>
                  </div>
                </Card>

                <div className="mt-8 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/market">
                    <Button size="xl" className="w-full sm:w-auto">
                      Launch App
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Hero Visual */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-primary to-primary-hover sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center animate-slide-up">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Testnet Ready</h3>
              <p className="text-blue-100 mt-2">Base Goerli Network</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-surface">
        <div className="container-main">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 heading-2 sm:text-4xl">
              Built for Safety & Trust
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="text-center animate-slide-up">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mt-4 heading-4">On-Chain Reputation</h3>
                <p className="mt-2 body text-text-secondary">
                  Every trade builds your trust score, creating a transparent reputation system.
                </p>
              </div>

              <div className="text-center animate-slide-up">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mt-4 heading-4">Secure Escrow</h3>
                <p className="mt-2 body text-text-secondary">
                  Smart contract escrow protects both buyers and sellers during trades.
                </p>
              </div>

              <div className="text-center animate-slide-up">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 heading-4">Community Driven</h3>
                <p className="mt-2 body text-text-secondary">
                  Built by the community, for the community. Open source and transparent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}