"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ProfileSelector from '@/components/dashboard/ProfileSelector';

interface Profile {
    id: string;
    name: string;
    avatar_url: string;
}

export default function Home() {
    const { activeProfile, setActiveProfile } = useApp();
    const router = useRouter();

    const handleProfileSelect = (profile: Profile) => {
        setActiveProfile(profile);
        router.push('/dashboard');
    };

    const mockProfiles: Profile[] = [
        { id: '1', name: 'Saad', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Saad' },
        { id: '2', name: 'Wajiha', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wajiha' },
        { id: '3', name: 'Work', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Work' }
    ];

    // If profile is already active, redirect to dashboard automatically
    useEffect(() => {
        if (activeProfile) {
            router.push('/dashboard');
        }
    }, [activeProfile, router]);

    return (
        <main className="bg-[#0F172A] min-h-screen">
            <ProfileSelector profiles={mockProfiles} onSelect={handleProfileSelect} />
        </main>
    );
}
