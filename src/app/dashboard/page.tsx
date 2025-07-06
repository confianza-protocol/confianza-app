import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import TrustBadge from '@/components/ui/TrustBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Dashboard - Confianza',
  description: 'Your Confianza dashboard',
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
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
    <div className="container-main py-8">
      <div className="mb-8 animate-in">
        <h1 className="heading-1">Dashboard</h1>
        <p className="mt-2 body-large text-text-secondary">Welcome back, {profile?.username || 'User'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Trust Score Card */}
        <Card hover className="animate-slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrustBadge tier={profile?.trust_scores?.tier as any || 'unverified'} />
            </div>
            <div className="ml-4">
              <p className="body-small">Trust Tier</p>
              <p className="heading-4 capitalize">
                {profile?.trust_scores?.tier || 'Unverified'}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Trades Card */}
        <Card hover className="animate-slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="body-small">Total Trades</p>
              <p className="heading-4">
                {profile?.trust_scores?.total_trades || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Success Rate Card */}
        <Card hover className="animate-slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="body-small">Success Rate</p>
              <p className="heading-4 text-success">
                {profile?.trust_scores?.total_trades > 0 
                  ? Math.round((profile.trust_scores.successful_trades / profile.trust_scores.total_trades) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="heading-3 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/market">
            <Card hover className="text-center p-6 group cursor-pointer animate-slide-up">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors duration-200">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-medium text-text-primary">Browse Market</p>
            </Card>
          </Link>
          
          <Link href="/offers/create">
            <Card hover className="text-center p-6 group cursor-pointer animate-slide-up">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-success/30 transition-colors duration-200">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="font-medium text-text-primary">Create Offer</p>
            </Card>
          </Link>
          
          <Card className="text-center p-6 opacity-50 cursor-not-allowed animate-slide-up">
            <div className="w-12 h-12 bg-text-muted/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="font-medium text-text-muted">My Trades</p>
          </Card>
          
          <Card className="text-center p-6 opacity-50 cursor-not-allowed animate-slide-up">
            <div className="w-12 h-12 bg-text-muted/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-medium text-text-muted">Settings</p>
          </Card>
        </div>
      </div>

      {/* Recent Trades */}
      {recentTrades && recentTrades.length > 0 && (
        <div className="animate-slide-up">
          <h2 className="heading-3 mb-6">Recent Trades</h2>
          <Card>
            <div className="divide-y divide-border">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="p-6 hover:bg-surface/50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">
                        {trade.offers?.crypto_asset} → {trade.offers?.fiat_currency}
                      </p>
                      <p className="body-small">
                        {trade.crypto_amount} {trade.offers?.crypto_asset} • {formatCurrency(trade.fiat_amount, trade.offers?.fiat_currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={trade.status} />
                      <Link
                        href={`/trade/${trade.id}`}
                        className="block text-sm text-primary hover:text-primary-hover mt-1 transition-colors duration-200"
                      >
                        View Trade →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}