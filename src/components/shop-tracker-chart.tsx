'use client';

import type { ShopSnapshot } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ShopTrackerChartProps {
  data: ShopSnapshot[];
  shopName: string;
}

export function ShopTrackerChart({ data, shopName }: ShopTrackerChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tracking Data for {shopName}</CardTitle>
          <CardDescription>
            Not enough data to display a chart. Check back tomorrow for an update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            <p>No tracking data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Trend for {shopName}</CardTitle>
        <CardDescription>
          Sales, listings, and followers over the last week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              yAxisId="left"
            />
             <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              orientation="right"
              yAxisId="right"
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--accent))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Area yAxisId="left" type="monotone" dataKey="transaction_sold_count" name="Sales" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorSales)" />
            <Area yAxisId="right" type="monotone" dataKey="listing_active_count" name="Listings" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorListings)" />
            <Area yAxisId="right" type="monotone" dataKey="num_favorers" name="Followers" stroke="hsl(var(--chart-3))" fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
