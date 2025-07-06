/*
  # Row Level Security Setup

  1. Security
    - Enable RLS on all tables
    - Add comprehensive security policies for all tables
    - Ensure users can only access their own data
    - Allow public access to necessary marketplace data

  2. Policies
    - Profiles: Users can manage their own profiles, public viewing for authenticated users
    - Admins: Only admins can view admin table
    - Wallets: Users can only access their own wallets
    - Trust Scores: Public viewing for authenticated users, users can insert their own
    - Offers: Public viewing of active offers, users can manage their own
    - Trades: Only trade participants can access
    - Disputes: Only trade participants can access
    - Feedback: Public viewing, only trade participants can create
*/

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Public profiles are viewable by all authenticated users" ON public.profiles;

  CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Public profiles are viewable by all authenticated users"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

  -- Admins policies
  DROP POLICY IF EXISTS "Only admins can view admin table" ON public.admins;

  CREATE POLICY "Only admins can view admin table"
    ON public.admins
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.admins
        WHERE user_id = auth.uid()
      )
    );

  -- Wallets policies
  DROP POLICY IF EXISTS "Users can view their own wallets" ON public.wallets;
  DROP POLICY IF EXISTS "Users can insert their own wallets" ON public.wallets;
  DROP POLICY IF EXISTS "Users can update their own wallets" ON public.wallets;

  CREATE POLICY "Users can view their own wallets"
    ON public.wallets
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own wallets"
    ON public.wallets
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own wallets"
    ON public.wallets
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  -- Trust scores policies
  DROP POLICY IF EXISTS "Trust scores are viewable by all authenticated users" ON public.trust_scores;
  DROP POLICY IF EXISTS "Users can insert their own trust score" ON public.trust_scores;

  CREATE POLICY "Trust scores are viewable by all authenticated users"
    ON public.trust_scores
    FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can insert their own trust score"
    ON public.trust_scores
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  -- Offers policies
  DROP POLICY IF EXISTS "Active offers are viewable by all authenticated users" ON public.offers;
  DROP POLICY IF EXISTS "Users can view their own offers" ON public.offers;
  DROP POLICY IF EXISTS "Users can insert their own offers" ON public.offers;
  DROP POLICY IF EXISTS "Users can update their own offers" ON public.offers;

  CREATE POLICY "Active offers are viewable by all authenticated users"
    ON public.offers
    FOR SELECT
    TO authenticated
    USING (status = 'active');

  CREATE POLICY "Users can view their own offers"
    ON public.offers
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own offers"
    ON public.offers
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own offers"
    ON public.offers
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  -- Trades policies
  DROP POLICY IF EXISTS "Users can view trades they are involved in" ON public.trades;
  DROP POLICY IF EXISTS "Users can insert trades as buyers" ON public.trades;
  DROP POLICY IF EXISTS "Trade participants can update trades" ON public.trades;

  CREATE POLICY "Users can view trades they are involved in"
    ON public.trades
    FOR SELECT
    TO authenticated
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

  CREATE POLICY "Users can insert trades as buyers"
    ON public.trades
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = buyer_id);

  CREATE POLICY "Trade participants can update trades"
    ON public.trades
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

  -- Disputes policies
  DROP POLICY IF EXISTS "Trade participants can view disputes" ON public.disputes;
  DROP POLICY IF EXISTS "Trade participants can create disputes" ON public.disputes;

  CREATE POLICY "Trade participants can view disputes"
    ON public.disputes
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.trades
        WHERE trades.id = disputes.trade_id
        AND (trades.buyer_id = auth.uid() OR trades.seller_id = auth.uid())
      )
    );

  CREATE POLICY "Trade participants can create disputes"
    ON public.disputes
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.trades
        WHERE trades.id = disputes.trade_id
        AND (trades.buyer_id = auth.uid() OR trades.seller_id = auth.uid())
      )
      AND auth.uid() = opened_by_user_id
    );

  -- Feedback policies
  DROP POLICY IF EXISTS "Feedback is viewable by all authenticated users" ON public.feedback;
  DROP POLICY IF EXISTS "Trade participants can leave feedback" ON public.feedback;

  CREATE POLICY "Feedback is viewable by all authenticated users"
    ON public.feedback
    FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Trade participants can leave feedback"
    ON public.feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.trades
        WHERE trades.id = feedback.trade_id
        AND (trades.buyer_id = auth.uid() OR trades.seller_id = auth.uid())
      )
      AND auth.uid() = reviewer_id
    );

END $$;