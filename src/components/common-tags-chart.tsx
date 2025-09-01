'use client';

import type { EtsyListing } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tags } from 'lucide-react';
import { useMemo } from 'react';

interface CommonTagsChartProps {
  listings: EtsyListing[];
}

const TOP_TAGS_COUNT = 20;

export function CommonTagsChart({ listings }: CommonTagsChartProps) {
  const commonTags = useMemo(() => {
    if (!listings || listings.length === 0) {
      return [];
    }

    const tagCounts = new Map<string, number>();

    for (const listing of listings) {
      if (listing.tags) {
        for (const tag of listing.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }
    }

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_TAGS_COUNT);
  }, [listings]);

  if (commonTags.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Most Common Tags
        </CardTitle>
        <CardDescription>
            These are the most frequently used tags among the top listings for this keyword.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {commonTags.map(([tag, count]) => (
            <div key={tag} className="relative">
              <Badge variant="secondary" className="pr-5">
                {tag}
              </Badge>
              <div className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
