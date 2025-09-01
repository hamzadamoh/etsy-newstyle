"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateNicheIdeas, type GenerateNicheIdeasOutput } from "@/ai/flows/niche-finder-flow";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wand2, Lightbulb } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const etsyCategories = [
    "Accessories",
    "Art & Collectibles",
    "Bags & Purses",
    "Bath & Beauty",
    "Books, Movies & Music",
    "Clothing",
    "Craft Supplies & Tools",
    "Electronics & Accessories",
    "Home & Living",
    "Jewelry",
    "Paper & Party Supplies",
    "Pet Supplies",
    "Shoes",
    "Toys & Games",
    "Weddings",
];


export function NicheFinder() {
  const [category, setCategory] = useState("");
  const [ideas, setIdeas] = useState<GenerateNicheIdeasOutput['niches']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateIdeas = async () => {
    if (!category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a category first.",
      });
      return;
    }
    setIsLoading(true);
    setIdeas([]);
    try {
      const result = await generateNicheIdeas({ category });
      setIdeas(result.niches);
    } catch (error) {
      console.error("Failed to generate niche ideas:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate niche ideas at this time. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Next Big Idea</CardTitle>
          <CardDescription>
            Select a broad category and let our AI analyst suggest profitable niches for you to explore.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-select">Etsy Category</Label>
            <Select onValueChange={setCategory} value={category} disabled={isLoading}>
                <SelectTrigger id="category-select">
                    <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                    {etsyCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateIdeas} disabled={isLoading || !category}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Ideas
          </Button>
        </CardFooter>
      </Card>

      {isLoading && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-5/6" />
                         <div className="flex flex-wrap gap-2 pt-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                         </div>
                    </CardContent>
                </Card>
            ))}
         </div>
      )}

      {ideas.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea, index) => (
                <Card key={index} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-start gap-2">
                            <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <span>{idea.niche}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground mb-4">{idea.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {idea.keywords.map((kw, i) => (
                                <Badge key={i} variant="secondary">{kw}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
