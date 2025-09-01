"use client";

import { useState, useActionState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { getKeywordData, type KeywordResearchState } from "@/app/actions";
import { generateKeywordIdeas } from "@/ai/flows/keyword-research-flow";
import { Wand2, Search, BarChart, Users, Heart, Eye } from "lucide-react";
import Image from "next/image";

const initialEtsyState: KeywordResearchState = {
  listings: [],
  count: 0,
  error: null,
};

export function KeywordResearch() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [etsyState, formAction, isEtsyLoading] = useActionState(getKeywordData, initialEtsyState);

  useEffect(() => {
    if (etsyState.error) {
      toast({
        variant: "destructive",
        title: "Etsy API Error",
        description: etsyState.error,
      });
    }
  }, [etsyState.error, toast]);

  const handleGenerateIdeas = async () => {
    if (!keyword.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a seed keyword first.",
      });
      return;
    }
    setIsAiLoading(true);
    setRelatedKeywords([]);
    try {
      const result = await generateKeywordIdeas({ seedKeyword: keyword });
      setRelatedKeywords(result.relatedKeywords);
    } catch (error) {
      console.error("Failed to generate keyword ideas:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate keyword ideas at this time.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleKeywordClick = (kw: string) => {
    setKeyword(kw);
    // You could also auto-submit the form here if desired
    // const formData = new FormData();
    // formData.append('keyword', kw);
    // formAction(formData);
  };
  
  const isLoading = isEtsyLoading || isAiLoading;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Keyword Search</CardTitle>
            <CardDescription>
              Enter a keyword to analyze its competition and see top-ranking listings on Etsy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="keyword">Keyword</Label>
            <div className="flex gap-2">
              <Input
                id="keyword"
                name="keyword"
                placeholder="e.g., 'digital planner'"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading}
              />
              <Button type="button" variant="outline" onClick={handleGenerateIdeas} disabled={isLoading}>
                <Wand2 className="mr-2 h-4 w-4" />
                {isAiLoading ? "Generating..." : "Get Ideas"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isEtsyLoading ? "Analyzing..." : "Analyze Keyword"}
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      {(relatedKeywords.length > 0 || etsyState.count > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            {relatedKeywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Ideas</CardTitle>
                  <CardDescription>Click a keyword to analyze it.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {relatedKeywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/20"
                        onClick={() => handleKeywordClick(kw)}
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
             {etsyState.count > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Competition</CardTitle>
                        <CardDescription>Total listings for this keyword.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="text-3xl font-bold">{etsyState.count.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Listings</p>
                        </div>
                    </CardContent>
                </Card>
             )}
          </div>

          <div className="lg:col-span-2">
            {etsyState.listings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Listings</CardTitle>
                  <CardDescription>
                    These are the current top-ranking listings for your keyword.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {etsyState.listings.map((listing) => (
                    <div key={listing.listing_id} className="border rounded-lg p-3 space-y-2">
                      <p className="font-medium truncate" title={listing.title}>
                        <a href={listing.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {listing.title}
                        </a>
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{listing.num_favorers.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{listing.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
