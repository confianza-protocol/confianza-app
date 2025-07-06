import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="ml-2 text-xl font-bold text-text-primary">Confianza</span>
            </div>
            <p className="text-text-secondary text-sm max-w-md leading-relaxed">
              The safest way to buy and sell crypto in Latin America. Building a community of trust through on-chain reputation.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                Base Goerli Testnet
              </span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/market" className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-200">
                  Marketplace
                </Link>
              </li>
              <li>
                <span className="text-text-muted text-sm cursor-not-allowed">
                  Trust Scores
                </span>
              </li>
              <li>
                <span className="text-text-muted text-sm cursor-not-allowed">
                  Security
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-text-muted text-sm cursor-not-allowed">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-text-muted text-sm cursor-not-allowed">
                  Contact Us
                </span>
              </li>
              <li>
                <Link 
                  href="https://github.com/confianza-protocol" 
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-muted text-sm">
              © 2025 Confianza Protocol. Open source under MIT License.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <span className="text-text-muted text-sm cursor-not-allowed">Privacy Policy</span>
              <span className="text-text-muted text-sm cursor-not-allowed">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}