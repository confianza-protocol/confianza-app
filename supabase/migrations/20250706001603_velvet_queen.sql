/*
  # Confianza Platform Database Schema v1.1
  
  This migration creates the complete database architecture for the Confianza P2P trading platform.
  
  ## Tables Created:
  1. **profiles** - User profile information
  2. **admins** - Platform administrators
  3. **wallets** - User wallet addresses
  4. **trust_scores** - User reputation and trust metrics
  5. **offers** - Trading offers posted by users
  6. **trades** - Individual trade transactions
  7. **disputes** - Trade dispute management
  8. **feedback** - User feedback and ratings
  
  ## Security:
  - Row Level Security (RLS) enabled on all tables
  - Comprehensive security policies for data access
  - Admin-only access controls where appropriate
  
  ## Performance:
  - Strategic indexes for common query patterns
  - Optimized for read-heavy workloads
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Types (ENUMs)
CREATE TYPE public.offer_status AS ENUM ('active', 'paused', 'completed', 'closed');
CREATE TYPE public.trade_status AS ENUM ('pending', 'in_progress', 'payment_sent', 'completed', 'disputed', 'cancelled');
CREATE TYPE public.dispute_status AS ENUM ('open', 'awaiting_response', 'resolved_for_buyer', 'resolved_for_seller', 'resolved_by_mutual');
CREATE TYPE public.trust_tier AS ENUM ('unverified', 'bronze', 'silver', 'gold');
CREATE TYPE public.feedback_rating AS ENUM ('positive', 'neutral', 'negative');

-- Table: profiles
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    status text DEFAULT 'active',
    invite_code_used uuid NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: admins
CREATE TABLE public.admins (
    user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Table: wallets
CREATE TABLE public.wallets (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    address text UNIQUE NOT NULL,
    wallet_type text NOT NULL DEFAULT 'embedded',
    created_at timestamptz DEFAULT now()
);

-- Table: trust_scores
CREATE TABLE public.trust_scores (
    user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier public.trust_tier NOT NULL DEFAULT 'unverified',
    total_trades integer DEFAULT 0,
    successful_trades integer DEFAULT 0,
    disputes_opened integer DEFAULT 0,
    disputes_involved integer DEFAULT 0,
    total_trade_volume_usd numeric(15, 2) DEFAULT 0.00,
    positive_feedback integer DEFAULT 0,
    negative_feedback integer DEFAULT 0,
    last_calculated_at timestamptz DEFAULT now()
);

-- Table: offers
CREATE TABLE public.offers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status public.offer_status NOT NULL DEFAULT 'active',
    crypto_asset text NOT NULL DEFAULT 'USDC',
    fiat_currency text NOT NULL DEFAULT 'CRC',
    price_per_crypto numeric(15, 2) NOT NULL,
    min_trade_limit numeric(15, 2) NOT NULL,
    max_trade_limit numeric(15, 2) NOT NULL,
    available_amount numeric(20, 8) NOT NULL,
    payment_method_details jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table: trades
CREATE TABLE public.trades (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id uuid NOT NULL REFERENCES public.offers(id),
    buyer_id uuid NOT NULL REFERENCES public.profiles(id),
    seller_id uuid NOT NULL REFERENCES public.profiles(id),
    status public.trade_status NOT NULL DEFAULT 'pending',
    crypto_amount numeric(20, 8) NOT NULL,
    fiat_amount numeric(15, 2) NOT NULL,
    fee_amount_usd numeric(10, 4) DEFAULT 0.00,
    escrow_contract_address text NOT NULL,
    created_at timestamptz DEFAULT now(),
    completed_at timestamptz NULL
);

-- Table: disputes
CREATE TABLE public.disputes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id uuid UNIQUE NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE,
    opened_by_user_id uuid NOT NULL REFERENCES public.profiles(id),
    status public.dispute_status NOT NULL DEFAULT 'open',
    reason text NOT NULL,
    resolution_notes text NULL,
    created_at timestamptz DEFAULT now(),
    resolved_at timestamptz NULL
);

-- Table: feedback
CREATE TABLE public.feedback (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id uuid UNIQUE NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE,
    reviewer_id uuid NOT NULL REFERENCES public.profiles(id),
    reviewee_id uuid NOT NULL REFERENCES public.profiles(id),
    rating public.feedback_rating NOT NULL,
    comment text NULL,
    created_at timestamptz DEFAULT now()
);

-- Indexes for Performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_offers_currency_status ON public.offers(fiat_currency, crypto_asset, status);
CREATE INDEX idx_trades_buyer_id ON public.trades(buyer_id);
CREATE INDEX idx_trades_seller_id ON public.trades(seller_id);
CREATE INDEX idx_feedback_reviewee_id ON public.feedback(reviewee_id);
CREATE INDEX idx_wallets_address ON public.wallets(address);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by all authenticated users" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for admins table
CREATE POLICY "Only admins can view admin table" ON public.admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for wallets table
CREATE POLICY "Users can view their own wallets" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets" ON public.wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets" ON public.wallets
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for trust_scores table
CREATE POLICY "Trust scores are viewable by all authenticated users" ON public.trust_scores
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own trust score" ON public.trust_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for offers table
CREATE POLICY "Active offers are viewable by all authenticated users" ON public.offers
    FOR SELECT USING (auth.role() = 'authenticated' AND status = 'active');

CREATE POLICY "Users can view their own offers" ON public.offers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own offers" ON public.offers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own offers" ON public.offers
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for trades table
CREATE POLICY "Users can view trades they are involved in" ON public.trades
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can insert trades as buyers" ON public.trades
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Trade participants can update trades" ON public.trades
    FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS Policies for disputes table
CREATE POLICY "Trade participants can view disputes" ON public.disputes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trades 
            WHERE id = trade_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

CREATE POLICY "Trade participants can create disputes" ON public.disputes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trades 
            WHERE id = trade_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
        AND auth.uid() = opened_by_user_id
    );

-- RLS Policies for feedback table
CREATE POLICY "Feedback is viewable by all authenticated users" ON public.feedback
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Trade participants can leave feedback" ON public.feedback
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trades 
            WHERE id = trade_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
        AND auth.uid() = reviewer_id
    );

-- Function to automatically create trust_score when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.trust_scores (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create trust_score for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update trust scores (placeholder for future implementation)
CREATE OR REPLACE FUNCTION public.calculate_trust_score(user_uuid uuid)
RETURNS void AS $$
BEGIN
    -- This function will be implemented to calculate and update trust scores
    -- based on trading history, feedback, and other metrics
    UPDATE public.trust_scores 
    SET last_calculated_at = now()
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;