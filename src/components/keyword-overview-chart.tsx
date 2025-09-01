'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, TrendingUp } from 'lucide-react';
import { format, subMonths } from 'date-fns';

interface KeywordOverviewChartProps {
  keyword: string;
  competition: number;
}

const generateChartData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const month = subMonths(now, i);
    data.push({
      name: format(month, 'MMM'),
      'Search volume': Math.floor(Math.random() * 80) + 10,
    });
  }
  return data;
};

const MetricCard = ({ title, value, badgeText, badgeVariant, changeText, changeColor }: { title: string; value: string; badgeText?: string; badgeVariant?: "secondary" | "destructive" | "outline" | "default" | undefined; changeText?: string; changeColor?: string }) => (
    <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="flex items-baseline gap-2 mt-1">
            <div className="text-3xl font-bold">{value}</div>
            {changeText && (
                <div className={`text-sm font-semibold ${changeColor}`}>
                    <span className="text-xs">→</span> {changeText}
                </div>
            )}
            {badgeText && <Badge variant={badgeVariant || 'secondary'}>{badgeText}</Badge>}
        </div>
    </div>
);

export function KeywordOverviewChart({ keyword, competition }: KeywordOverviewChartProps) {
  const [chartData, setChartData] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    // Generate data on client to avoid hydration mismatch
    setChartData(generateChartData());
  }, [keyword]);

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
            Overview <span className="font-normal text-muted-foreground">{keyword}</span>
          </CardTitle>
        </div>
        <button className="p-2 rounded-full hover:bg-muted">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Add to favorites</span>
        </button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Search volume" value="0" changeText="→ 0%" changeColor="text-yellow-500" />
            <MetricCard title="Competition" value={competition.toLocaleString()} badgeText={competitionBadge.text} badgeVariant={competitionBadge.variant} />
            <MetricCard title="Conversion rate" value="4.60%" badgeText="Very high" badgeVariant="default" />
            <MetricCard title="Score" value="44" badgeText="Average" badgeVariant="secondary" />
        </div>
        
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                    />
                    <Line type="monotone" dataKey="Search volume" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>

      </CardContent>
    </Card>
  );
}
