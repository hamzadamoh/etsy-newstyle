"use client";

import { useState, useActionState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { TopListingsTable } from "@/components/top-listings-table";
import { getKeywordData, type KeywordResearchState } from "@/app/actions";
import { generateKeywordIdeas } from "@/ai/flows/keyword-research-flow";
import { Wand2, Search } from "lucide-react";
import { KeywordOverviewChart } from "./keyword-overview-chart";
import { CommonTagsChart } from "./common-tags-chart";


const initialEtsyState: KeywordResearchState = {
  listings: [],
  count: 0,
  error: null,
  avgPrice: 0,
  avgFavorites: 0,
};

export function KeywordResearch() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [etsyState, formAction, isEtsyLoading] = useActionState(getKeywordData, initialEtsyState);
  
  const handleFormAction = (formData: FormData) => {
    const kw = formData.get("keyword") as string;
    setSubmittedKeyword(kw);
    formAction(formData);
  }

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
    } catch (error)
 {
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
    const formData = new FormData();
    formData.append('keyword', kw);
    handleFormAction(formData);
  };
  
  const isLoading = isEtsyLoading || isAiLoading;

  return (
    <div className="space-y-8">
      <Card>
        <form action={handleFormAction}>
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
      
      {etsyState.count > 0 && (
        <KeywordOverviewChart 
            keyword={submittedKeyword} 
            competition={etsyState.count}
            avgPrice={etsyState.avgPrice}
            avgFavorites={etsyState.avgFavorites}
        />
      )}

      {(relatedKeywords.length > 0) && (
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
            
      {etsyState.listings.length > 0 && (
        <>
          <CommonTagsChart listings={etsyState.listings} />
          <TopListingsTable listings={etsyState.listings} count={etsyState.count} />
        </>
      )}
    </div>
  );
}
