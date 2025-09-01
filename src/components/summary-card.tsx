"use client";

import { useEffect, useState, useMemo } from "react";
import { summarizeListings } from "@/ai/flows/summarize-listings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";
import type { EtsyListing } from "@/lib/types";

interface SummaryCardProps {
  listings: EtsyListing[];
}

export function SummaryCard({ listings }: SummaryCardProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listingsString = useMemo(() => {
    return listings
      .map((l) => `Title: ${l.title}, Tags: [${l.tags.join(", ")}]`)
      .join("\n");
  }, [listings]);

  useEffect(() => {
    if (listingsString) {
      const generateSummary = async () => {
        setLoading(true);
        setError(null);
        setSummary("");
        try {
          const result = await summarizeListings({ listings: listingsString });
          setSummary(result.summary);
        } catch (e) {
          console.error("Failed to generate summary:", e);
          setError("Could not generate summary at this time.");
        } finally {
          setLoading(false);
        }
      };
      generateSummary();
    }
  }, [listingsString]);
  
  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          AI-Powered Summary
        </CardTitle>
        <CardDescription>
          A brief summary of the {listings.length} listings that match your criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && <p className="text-sm text-foreground/90">{summary}</p>}
      </CardContent>
    </Card>
  );
}
