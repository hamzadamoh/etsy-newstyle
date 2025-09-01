'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, DollarSign } from 'lucide-react';

interface KeywordOverviewChartProps {
  keyword: string;
  competition: number;
  avgPrice: number;
  avgFavorites: number;
}

const MetricCard = ({ title, value, icon, badgeText, badgeVariant }: { title: string; value: string; icon: React.ReactNode; badgeText?: string; badgeVariant?: "secondary" | "destructive" | "outline" | "default" | undefined; }) => (
    <div className="p-4 rounded-lg bg-secondary/50 flex-1 min-w-[200px]">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
            {icon}
            {title}
        </div>
        <div className="flex items-baseline gap-2 mt-1">
            <div className="text-3xl font-bold">{value}</div>
            {badgeText && <Badge variant={badgeVariant || 'secondary'}>{badgeText}</Badge>}
        </div>
    </div>
);

export function KeywordOverviewChart({ keyword, competition, avgPrice, avgFavorites }: KeywordOverviewChartProps) {
  if (!keyword) return null;
  
  const getCompetitionBadge = (count: number) => {
    if (count > 100000) return { text: 'Very High', variant: 'destructive' as const };
    if (count > 50000) return { text: 'High', variant: 'destructive' as const };
    if (count > 10000) return { text: 'Moderate', variant: 'secondary' as const };
    return { text: 'Low', variant: 'default' as const };
  }

  const competitionBadge = getCompetitionBadge(competition);

  return (
    <Card>
      <CardHeader>
          <CardTitle className="text-2xl">
            Overview: <span className="font-normal text-primary">{keyword}</span>
          </CardTitle>
          <CardDescription>
            High-level metrics for this keyword based on an analysis of top listings.
          </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
            <MetricCard 
                title="Competition" 
                value={competition.toLocaleString()} 
                icon={<Users className="h-4 w-4" />}
                badgeText={competitionBadge.text} 
                badgeVariant={competitionBadge.variant} 
            />
            <MetricCard 
                title="Avg. Price" 
                value={`$${avgPrice.toFixed(2)}`}
                icon={<DollarSign className="h-4 w-4" />}
            />
            <MetricCard 
                title="Avg. Favorites" 
                value={Math.round(avgFavorites).toLocaleString()}
                icon={<Heart className="h-4 w-4" />}
            />
        </div>
      </CardContent>
    </Card>
  );
}
