-- Migration: Initial setup for Credit Card Debt Simulator (Bank Alfalah Visa Platinum)
-- Description: Creates tables for card configuration, ledger, daily snapshots, and payment simulations.

-- 1. Table: card_config
-- Stores specific credit card settings and limits
CREATE TABLE IF NOT EXISTS public.card_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credit_limit NUMERIC(15, 2) NOT NULL DEFAULT 300000,
    monthly_interest_rate NUMERIC(10, 5) NOT NULL DEFAULT 0.0392,
    late_fee NUMERIC(15, 2) NOT NULL DEFAULT 2500,
    annual_fee NUMERIC(15, 2) NOT NULL DEFAULT 23000,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

COMMENT ON COLUMN public.card_config.monthly_interest_rate IS 'Monthly interest rate as a decimal (e.g., 0.0392 for 3.92%)';

-- 2. Table: ledger
-- Records all transactions including Date, Description, Amount, and Category
CREATE TABLE IF NOT EXISTS public.ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Purchase', 'Payment', 'Interest', 'Fee', 'Utility Bill')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table: daily_snapshots
-- Tracks the running_balance for every day of the month for ADB calculation
CREATE TABLE IF NOT EXISTS public.daily_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    running_balance NUMERIC(15, 2) NOT NULL,
    UNIQUE(user_id, date)
);

-- 4. Table: payment_simulations
-- Saves different monthly payment strategies for comparison
CREATE TABLE IF NOT EXISTS public.payment_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    payment_amount NUMERIC(15, 2) NOT NULL,
    projected_interest NUMERIC(15, 2),
    projected_balance NUMERIC(15, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.card_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_simulations ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies
CREATE POLICY "Users can manage their own card_config" ON public.card_config
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own ledger" ON public.ledger
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own daily_snapshots" ON public.daily_snapshots
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own payment_simulations" ON public.payment_simulations
    FOR ALL USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_card_config_updated_at
    BEFORE UPDATE ON public.card_config
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
