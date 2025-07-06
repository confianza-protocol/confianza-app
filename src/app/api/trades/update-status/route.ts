import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { TradeStatus } from '@/types/database'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      logger.warn('Unauthorized trade status update attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tradeId, newStatus, userRole } = await request.json()

    if (!tradeId || !newStatus || !userRole) {
      logger.warn('Invalid trade status update request', { tradeId, newStatus, userRole })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch the trade to verify user permissions
    const { data: trade, error: fetchError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single()

    if (fetchError || !trade) {
      logger.error('Trade not found', fetchError, { tradeId, userId: user.id })
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    // Verify user is part of this trade
    const isAuthorized = trade.buyer_id === user.id || trade.seller_id === user.id
    if (!isAuthorized) {
      logger.warn('User attempted to update trade they are not part of', {
        tradeId,
        userId: user.id,
        buyerId: trade.buyer_id,
        sellerId: trade.seller_id
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Validate status transition
    const validTransitions: Record<TradeStatus, TradeStatus[]> = {
      pending: ['in_progress', 'cancelled', 'disputed'],
      in_progress: ['payment_sent', 'cancelled', 'disputed'],
      payment_sent: ['completed', 'disputed'],
      completed: [],
      disputed: [],
      cancelled: []
    }

    const allowedNextStatuses = validTransitions[trade.status as TradeStatus] || []
    if (!allowedNextStatuses.includes(newStatus as TradeStatus)) {
      logger.warn('Invalid status transition attempted', {
        tradeId,
        currentStatus: trade.status,
        attemptedStatus: newStatus,
        userId: user.id
      })
      return NextResponse.json({ 
        error: `Invalid status transition from ${trade.status} to ${newStatus}` 
      }, { status: 400 })
    }

    // Update the trade status
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    }

    // Set completion timestamp if trade is completed
    if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: updatedTrade, error: updateError } = await supabase
      .from('trades')
      .update(updateData)
      .eq('id', tradeId)
      .select()
      .single()

    if (updateError) {
      logger.error('Failed to update trade status', updateError, {
        tradeId,
        newStatus,
        userId: user.id
      })
      return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 })
    }

    logger.info('Trade status updated successfully', {
      tradeId,
      oldStatus: trade.status,
      newStatus,
      userId: user.id,
      userRole
    })

    return NextResponse.json({ 
      success: true, 
      status: updatedTrade.status,
      trade: updatedTrade
    })

  } catch (error) {
    logger.error('Unexpected error in trade status update', error as Error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}