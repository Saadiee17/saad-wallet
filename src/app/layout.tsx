import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Alfalah Wallet - Credit Card Debt Simulator',
    description: 'Track credit card interest and project future debt for Bank Alfalah Visa Platinum',
    manifest: '/manifest.json',
    themeColor: '#6366F1',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Alfalah Wallet',
    },
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

import { AppProvider } from '@/context/AppContext'
import BottomNav from '@/components/nav/BottomNav'
import StatusBar from '@/components/nav/StatusBar'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AppProvider>
                    <StatusBar />
                    {children}
                    <BottomNav />
                </AppProvider>
            </body>
        </html>
    )
}
