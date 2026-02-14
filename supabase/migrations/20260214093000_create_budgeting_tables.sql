-- Migration: Create budgeting tables
-- Description: Sets up the core tables for the Credit Card Budgeting PWA

-- 1. Table: card_settings
-- Stores global configurations for the credit card account
CREATE TABLE IF NOT EXISTS public.card_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    monthly_interest_rate NUMERIC(10, 5) NOT NULL DEFAULT 0.037, -- Default 3.7%
    late_fee NUMERIC(15, 2) NOT NULL DEFAULT 2500,               -- Default 2500
    annual_fee NUMERIC(15, 2) NOT NULL DEFAULT 0,
    credit_limit NUMERIC(15, 2) NOT NULL DEFAULT 300000,         -- Default 300000
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

COMMENT ON COLUMN public.card_settings.monthly_interest_rate IS 'Monthly interest rate as a decimal (e.g., 0.037 for 3.7%)';

-- 2. Table: transactions
-- Stores all credit card transactions (spending and payments)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('debit', 'credit')), -- debit = spending, credit = payment/refund
    is_interest_accruing BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table: daily_balances
-- Logs ending balance for every single day (crucial for accurate interest math)
CREATE TABLE IF NOT EXISTS public.daily_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    ending_balance NUMERIC(15, 2) NOT NULL,
    UNIQUE(user_id, date)
);

-- 4. Table: simulations
-- To save 'What-if' scenarios and debt-paydown projections
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    scenario_parameters JSONB NOT NULL, -- Flexible storage for simulation variables
    results_snapshot JSONB,             -- Optional: storage for the calculated outcome
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.card_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies (Users can only see/manage their own data)
CREATE POLICY "Users can manage their own card_settings" ON public.card_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own transactions" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own daily_balances" ON public.daily_balances
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own simulations" ON public.simulations
    FOR ALL USING (auth.uid() = user_id);

-- Helper trigger for updated_at in card_settings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_card_settings_updated_at
    BEFORE UPDATE ON public.card_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
