import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: any
  schema: string
  old_record: null | any
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: WebhookPayload = await req.json()
    
    // Only handle INSERT operations on auth.users
    if (payload.type === 'INSERT' && payload.table === 'users') {
      const user = payload.record
      const username = user.raw_user_meta_data?.username || `user_${user.id.slice(0, 8)}`

      // Create profile
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: user.id,
          username: username,
          status: 'active'
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        throw profileError
      }

      // Create trust score
      const { error: trustScoreError } = await supabaseClient
        .from('trust_scores')
        .insert({
          user_id: user.id,
          tier: 'unverified',
          total_trades: 0,
          successful_trades: 0,
          disputes_opened: 0,
          disputes_involved: 0,
          total_trade_volume_usd: 0.00,
          positive_feedback: 0,
          negative_feedback: 0
        })

      if (trustScoreError) {
        console.error('Error creating trust score:', trustScoreError)
        throw trustScoreError
      }

      console.log(`Successfully created profile and trust score for user ${user.id}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in handle-new-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})