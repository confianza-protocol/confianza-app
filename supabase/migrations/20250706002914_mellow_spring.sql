/*
  # Add Row Level Security Policies

  1. Security
    - Enable RLS on all tables
    - Add comprehensive policies for each table
    - Ensure proper access control for all operations

  2. Policies Overview
    - profiles: Users can manage their own profiles, all authenticated users can view public profiles
    - admins: Only admins can view admin table
    - wallets: Users can only access their own wallets
    - trust_scores: Public read access, users can insert their own
    - offers: Public read for active offers, users manage their own
    - trades: Only trade participants can access
    - disputes: Only trade participants can access
    - feedback: Public read access, trade participants can create
*/

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
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