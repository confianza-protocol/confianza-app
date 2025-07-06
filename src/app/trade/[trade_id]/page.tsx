import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Metadata } from 'next'
import LiveTradeInterface from '@/components/trade/LiveTradeInterface'

interface TradePageProps {
  params: {
    trade_id: string
  }
}

export const metadata: Metadata = {
  title: 'Live Trade - Confianza',
  description: 'Monitor and manage your active trade',
}

export default async function TradePage({ params }: TradePageProps) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the trade with related data
  const { data: trade, error } = await supabase
    .from('trades')
    .select(`
      *,
      offers!trades_offer_id_fkey (
        *,
        profiles!offers_user_id_fkey (
          username,
          trust_scores (*)
        )
      ),
      buyer:profiles!trades_buyer_id_fkey (
        username,
        trust_scores (*)
      ),
      seller:profiles!trades_seller_id_fkey (
        username,
        trust_scores (*)
      )
    `)
    .eq('id', params.trade_id)
    .single()

  if (error || !trade) {
    notFound()
  }

  // Verify user is part of this trade
  const isAuthorized = trade.buyer_id === user.id || trade.seller_id === user.id
  if (!isAuthorized) {
    redirect('/dashboard')
  }

  // Determine user role
  const userRole = trade.buyer_id === user.id ? 'buyer' : 'seller'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LiveTradeInterface 
        trade={trade}
        userRole={userRole}
        currentUserId={user.id}
      />
    </div>
  )
}