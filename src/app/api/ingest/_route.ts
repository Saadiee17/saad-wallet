import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * API Route: /api/ingest
 * Extracts transactions from Bank Alfalah PDF statements and upserts into Supabase.
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. Extract text from PDF
        const data = await pdf(buffer);
        const text = data.text;

        // 2. Parse Transactions
        // Typical Bank Alfalah format in text dump:
        // [Date] [Description] [Amount] [CR/DR]
        // Note: PDF text extraction can be messy, so we use regex or specific markers.
        const lines = text.split('\n');
        const transactions: any[] = [];

        // Simple regex for Date (DD MMM YY or similar)
        const dateRegex = /^(\d{2}\s[A-Z]{3}\s\d{2})/;

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Look for lines starting with a date
            if (dateRegex.test(trimmedLine)) {
                // Example: "28 FEB 26 SERVICE CHARGE 2,500.00 DR"
                const parts = trimmedLine.split(/\s+/);

                // Extracting components (simplified approach for demonstration)
                const dateStr = parts.slice(0, 3).join(' '); // "28 FEB 26"
                const amountPartIndex = parts.findLastIndex((p: string) => /^\d+(,\d+)*\.\d{2}$/.test(p));

                if (amountPartIndex !== -1) {
                    const description = parts.slice(3, amountPartIndex).join(' ');
                    const amountStr = parts[amountPartIndex].replace(/,/g, '');
                    const amount = parseFloat(amountStr);
                    const type = parts[amountPartIndex + 1]; // DR or CR

                    // Category Mapping
                    let category = 'Purchase';
                    if (description.includes('SERVICE CHARGE')) category = 'Interest';
                    if (description.includes('PAYMENT RECEIVED')) category = 'Payment';
                    if (description.includes('UTILITY BILL')) category = 'Utility Bill';
                    if (description.includes('LATE FEE')) category = 'Fee';

                    // For credit cards, CR on statement is a payment, DR is a purchase/charge
                    const finalAmount = type === 'CR' ? -amount : amount;

                    transactions.push({
                        date: formatDate(dateStr),
                        description,
                        amount: Math.abs(finalAmount),
                        category,
                        // We use description + date + amount as a crude unique key for upsert
                        external_id: `${dateStr}-${description}-${amount}`.replace(/\s+/g, '_')
                    });
                }
            }
        }

        if (transactions.length === 0) {
            return NextResponse.json({ error: 'No transactions found in PDF' }, { status: 422 });
        }

        // 3. Upsert into Supabase Ledger
        const { data: upsertData, error } = await supabase
            .from('ledger')
            .upsert(
                transactions.map(tx => ({
                    date: tx.date,
                    description: tx.description,
                    amount: tx.amount,
                    category: tx.category,
                    // user_id would normally come from auth
                    // user_id: auth_id
                })),
                { onConflict: 'description,date,amount' } // Assuming this unique constraint exists or using external_id
            );

        if (error) throw error;

        return NextResponse.json({
            message: 'Successfully ingested transactions',
            count: transactions.length,
            preview: transactions.slice(0, 5)
        });

    } catch (error: any) {
        console.error('Ingest Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Helper to convert "28 FEB 26" to "2026-02-28"
 */
function formatDate(dateStr: string): string {
    try {
        const [day, month, year] = dateStr.split(' ');
        const months: any = {
            JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
            JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
        };
        return `20${year}-${months[month]}-${day}`;
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}
