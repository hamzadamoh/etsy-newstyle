'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart } from 'lucide-react';

interface KeywordOverviewChartProps {
  keyword: string;
  competition: number;
}

const MetricCard = ({ title, value, badgeText, badgeVariant }: { title: string; value: string; badgeText?: string; badgeVariant?: "secondary" | "destructive" | "outline" | "default" | undefined; }) => (
    <div className="p-4 rounded-lg bg-secondary/50">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            {title}
        </div>
        <div className="flex items-baseline gap-2 mt-1">
            <div className="text-3xl font-bold">{value}</div>
            {badgeText && <Badge variant={badgeVariant || 'secondary'}>{badgeText}</Badge>}
        </div>
    </div>
);

export function KeywordOverviewChart({ keyword, competition }: KeywordOverviewChartProps) {
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
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-2xl">
            Overview: <span className="font-normal text-primary">{keyword}</span>
          </CardTitle>
        </div>
        <button className="p-2 rounded-full hover:bg-muted">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Add to favorites</span>
        </button>
      </CardHeader>
      <CardContent>
        <MetricCard 
            title="Competition (Active Listings)" 
            value={competition.toLocaleString()} 
            badgeText={competitionBadge.text} 
            badgeVariant={competitionBadge.variant} 
        />
      </CardContent>
    </Card>
  );
}
