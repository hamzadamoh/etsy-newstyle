"use client";

import type { EtsyShop, EtsyListing } from '@/lib/types';
import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, BarChart } from 'lucide-react';

interface FinancialInsightsProps {
  shop: EtsyShop;
  listings: EtsyListing[];
}

const StatCard = ({ title, value, colorClass }: { title: string, value: string | number, colorClass?: string }) => (
    <div className="text-center">
        <p className={`text-2xl font-bold ${colorClass || 'text-primary'}`}>{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
    </div>
);

export function FinancialInsights({ shop, listings }: FinancialInsightsProps) {
    const insights = useMemo(() => {
        const now = new Date();
        const shopAgeDays = differenceInDays(now, new Date(shop.create_date * 1000));
        const avgSalesDay = shopAgeDays > 0 ? (shop.transaction_sold_count / shopAgeDays).toFixed(1) : 0;
        
        const totalRevenue = listings.reduce((acc, l) => acc + (l.price || 0) * (l.views || 0) / 100, 0); // Simplified revenue est.
        
        // Fee estimations based on total revenue
        const transactionFee = totalRevenue * 0.065;
        const paymentProcessingFee = totalRevenue * 0.03;
        const listingFee = shop.listing_active_count * 0.20;
        const totalFees = transactionFee + paymentProcessingFee + listingFee;
        const netRevenue = totalRevenue - totalFees;

        const avgPrice = listings.length > 0 ? listings.reduce((acc, l) => acc + (l.price || 0), 0) / listings.length : 20;

        const revenueConservative = shop.transaction_sold_count * 15;
        const revenueModerate = shop.transaction_sold_count * 25;
        const revenuePremium = shop.transaction_sold_count * 35;

        return {
            avgSalesDay,
            salesStatus: shop.listing_active_count > 0 ? 'Active' : 'Inactive',
            generatingRevenue: shop.transaction_sold_count > 0 ? 'Yes' : 'No',
            transactionFee,
            paymentProcessingFee,
            listingFee,
            totalFees,
            netRevenue,
            revenueConservative,
            revenueModerate,
            revenuePremium,
        };
    }, [shop, listings]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 py-4 border-b border-border">
                    <StatCard title="Avg Sales/Day" value={insights.avgSalesDay} />
                    <StatCard title="Sales Status" value={insights.salesStatus} colorClass="text-green-400" />
                    <StatCard title="Generating Revenue" value={insights.generatingRevenue} colorClass="text-purple-400" />
                </div>
                
                <div className="p-4 rounded-lg bg-card-foreground/5">
                    <h3 className="flex items-center gap-2 font-semibold mb-4 text-sm text-muted-foreground">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Etsy Fee Calculator (Estimated)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm">
                        <div className="flex justify-between items-baseline">
                           <span>Transaction Fee (6.5%):</span>
                           <span className="font-mono ml-2">-${insights.transactionFee.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between items-baseline md:order-3">
                           <span>Payment Processing (3%):</span>
                            <span className="font-mono ml-2">-${insights.paymentProcessingFee.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between items-baseline md:order-5">
                           <span>Listing Fee ($0.20 each):</span>
                            <span className="font-mono ml-2">-${insights.listingFee.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-baseline font-bold md:order-2 text-red-500">
                           <span>Total Fees:</span>
                           <span className="font-mono ml-2">-${insights.totalFees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-baseline font-bold md:order-4 text-green-400">
                           <span>Net Revenue:</span>
                           <span className="font-mono ml-2">${insights.netRevenue.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-card-foreground/5">
                     <h3 className="flex items-center gap-2 font-semibold mb-4 text-sm text-muted-foreground">
                        <BarChart className="w-4 h-4 text-primary" />
                        Revenue Estimates (Based on Total Sales)
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-blue-400">${insights.revenueConservative.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Conservative ($15 avg)</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-400">${insights.revenueModerate.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Moderate ($25 avg)</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-400">${insights.revenuePremium.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Premium ($35 avg)</p>
                        </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-4">*Estimates based on total sales and typical Etsy product pricing ranges.</p>
                </div>

            </CardContent>
        </Card>
    );
}
