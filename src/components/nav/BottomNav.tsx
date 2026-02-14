"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sliders, GitBranch, List, LucideIcon } from 'lucide-react';

interface NavItem {
    label: string;
    path: string;
    icon: LucideIcon;
}

const items: NavItem[] = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Simulate', path: '/simulate', icon: Sliders },
    { label: 'Strategy', path: '/strategy', icon: GitBranch },
    { label: 'Activity', path: '/activity', icon: List },
];

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === '/' || pathname === '/settings' || pathname.includes('/breakdown')) return null;

    return (
        <div className="fixed bottom-10 left-0 right-0 px-8 z-50 pointer-events-none">
            <nav className="glass-morphism rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl pointer-events-auto max-w-sm mx-auto overflow-hidden">
                {items.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className="relative flex-1 py-4 flex flex-col items-center gap-1 transition-all group"
                        >
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active-bg"
                                        className="absolute inset-2 bg-white/5 rounded-3xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </AnimatePresence>

                            <Icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                                    }`}
                            />

                            {isActive && (
                                <motion.div
                                    layoutId="nav-dot"
                                    className="absolute bottom-2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
