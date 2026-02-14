"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { calculateMonthlyCharges, Transaction } from '@/lib/interest-utils';
import { supabase } from '@/lib/supabase';

interface Profile {
    id: string;
    name: string;
    avatar_url: string;
}

interface AppContextType {
    activeProfile: Profile | null;
    setActiveProfile: (profile: Profile | null) => void;
    sliderValue: number;
    setSliderValue: (val: number) => void;
    isSBS: boolean;
    setIsSBS: (val: boolean) => void;
    settlementAmount: number;
    setSettlementAmount: (val: number) => void;
    config: {
        creditLimit: number;
        currentBalance: number;
        unpaidMinimum: number;
        lastPaymentDate: string;
    };
    setConfig: (config: any) => void;
    simulation: any;
    isSyncing: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
    const [sliderValue, setSliderValue] = useState(15000);
    const [isSBS, setIsSBS] = useState(false);
    const [settlementAmount, setSettlementAmount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [config, setConfig] = useState({
        creditLimit: 300000,
        currentBalance: 262799,
        unpaidMinimum: 12400,
        lastPaymentDate: '2026-01-05'
    });

    const previousStatementBalance = 260000;
    const dailyBalances = Array(15).fill(248000);
    const statementDate = new Date('2026-03-15');
    const transactions: Transaction[] = [
        { category: 'Purchase', amount: 1500, postingDate: '2026-02-28' },
        { category: 'Utility Bill', amount: 6000, postingDate: '2026-03-05' }
    ];

    // Persist profile and fetch data
    useEffect(() => {
        const saved = localStorage.getItem('saad_active_profile');
        if (saved) {
            const profile = JSON.parse(saved);
            setActiveProfile(profile);
            fetchProfileData(profile.id);
        }
    }, []);

    const fetchProfileData = async (profileId: string) => {
        setIsSyncing(true);
        const { data, error } = await supabase
            .from('card_config')
            .select('*')
            .eq('profile_id', profileId)
            .single();

        if (data && !error) {
            setConfig({
                creditLimit: data.credit_limit,
                currentBalance: data.current_balance || 262799,
                unpaidMinimum: data.unpaid_minimum || 12400,
                lastPaymentDate: data.last_payment_date || '2026-01-05'
            });
            // You could also sync sliderValue if stored in DB
        }
        setIsSyncing(false);
    };

    const syncToDB = async (newConfig: any) => {
        if (!activeProfile) return;
        setIsSyncing(true);
        await supabase
            .from('card_config')
            .upsert({
                profile_id: activeProfile.id,
                credit_limit: newConfig.creditLimit,
                current_balance: newConfig.currentBalance,
                unpaid_minimum: newConfig.unpaidMinimum,
                last_payment_date: newConfig.lastPaymentDate,
                updated_at: new Date().toISOString()
            }, { onConflict: 'profile_id' });

        // Brief delay for the "Saved" feedback to be visible
        setTimeout(() => setIsSyncing(false), 1000);
    };

    const simulation = useMemo(() => {
        const simulated = calculateMonthlyCharges(
            dailyBalances,
            config.unpaidMinimum,
            sliderValue,
            previousStatementBalance,
            statementDate,
            config.creditLimit,
            transactions,
            isSBS
        );

        const LATE_FEE = isSBS ? 0 : 2500;
        const totalDeadMoney = LATE_FEE + (isSBS ? (config.currentBalance * 0.0288) : (simulated.projectedInterest + simulated.projectedFees));
        const debtReduction = sliderValue - totalDeadMoney;

        return {
            fees: simulated.projectedFees,
            interest: simulated.projectedInterest,
            debtReduction,
            totalDeadMoney
        };
    }, [config, sliderValue, isSBS]);

    return (
        <AppContext.Provider value={{
            activeProfile,
            setActiveProfile: (p) => {
                setActiveProfile(p);
                if (p) {
                    localStorage.setItem('saad_active_profile', JSON.stringify(p));
                    fetchProfileData(p.id);
                } else {
                    localStorage.removeItem('saad_active_profile');
                }
            },
            sliderValue,
            setSliderValue,
            isSBS,
            setIsSBS,
            settlementAmount,
            setSettlementAmount,
            config,
            setConfig: (c) => {
                setConfig(c);
                syncToDB(c);
            },
            simulation,
            isSyncing
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
