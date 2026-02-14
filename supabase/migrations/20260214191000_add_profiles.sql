-- Migration: Add profiles and multi-user support
-- Description: Creates a profiles table and links existing financial data to profiles.

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simple public access for bypass during dev (can be tightened later)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- 2. Add profile_id to existing tables
-- Adding to card_config
ALTER TABLE public.card_config ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id);

-- Adding to ledger
ALTER TABLE public.ledger ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id);

-- Adding to daily_snapshots
ALTER TABLE public.daily_snapshots ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id);

-- Adding to payment_simulations
ALTER TABLE public.payment_simulations ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id);

-- 3. Seed initial profiles
INSERT INTO public.profiles (name, avatar_url)
VALUES 
('Saad', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Saad'),
('Wajiha', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wajiha'),
('Work', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Work')
ON CONFLICT DO NOTHING;
