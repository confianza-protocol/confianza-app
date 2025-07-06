import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import TradeStatusBadge from '@/components/trade/TradeStatusBadge'</parameter>

export const metadata: Metadata = {
  title: 'Dashboard - Confianza',
  description: 'Your Confianza dashboard',
}

export default async function DashboardPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile, trust score, and recent trades
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      *,
      trust_scores (*)
    `)
    .eq('id', user.id)
    .single()

  // Fetch recent trades
  const { data: recentTrades } = await supabase
    .from('trades')
    .select(`
      *,
      offers!trades_offer_id_fkey (
        crypto_asset,
        fiat_currency,
        price_per_crypto
      )
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(5)

  if (profileError) {
    console.error('Error fetching profile:', profileError)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {profile?.username || 'User'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Trust Score Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-4 h-4 rounded-full ${
                profile?.trust_scores?.tier === 'gold' ? 'bg-yellow-500' :
                profile?.trust_scores?.tier === 'silver' ? 'bg-gray-400' :
                profile?.trust_scores?.tier === 'bronze' ? 'bg-amber-600' :
                'bg-gray-400'
              }`}></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Trust Tier</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {profile?.trust_scores?.tier || 'Unverified'}
              </p>
            </div>
          </div>
        </div>

        {/* Total Trades Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Trades</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.trust_scores?.total_trades || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.trust_scores?.total_trades > 0 
                  ? Math.round((profile.trust_scores.successful_trades / profile.trust_scores.total_trades) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/market"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Browse Market
          </Link>
          
          <Link
            href="/offers/create"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Offer
          </Link>
          
          <div className="bg-gray-300 text-gray-500 p-4 rounded-lg text-center cursor-not-allowed">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Trades
          </div>
          
          <div className="bg-gray-300 text-gray-500 p-4 rounded-lg text-center cursor-not-allowed">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      {recentTrades && recentTrades.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Trades</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {trade.offers?.crypto_asset} → {trade.offers?.fiat_currency}
                      </p>
                      <p className="text-sm text-gray-600">
                        {trade.crypto_amount} {trade.offers?.crypto_asset} • {trade.fiat_amount.toLocaleString()} {trade.offers?.fiat_currency}
                      </p>
                    </div>
                    <div className="text-right">
                      <TradeStatusBadge status={trade.status} />
                      <Link
                        href={`/trade/${trade.id}`}
                        className="block text-sm text-blue-600 hover:text-blue-500 mt-1"
                      >
                        View Trade →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}