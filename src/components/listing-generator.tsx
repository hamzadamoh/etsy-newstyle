"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateListing, type GenerateListingOutput } from "@/ai/flows/listing-generator-flow";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Wand2, Sparkles } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function ListingGenerator() {
  const [productIdea, setProductIdea] = useState("");
  const [listing, setListing] = useState<GenerateListingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateListing = async () => {
    if (!productIdea.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a product idea.",
      });
      return;
    }
    setIsLoading(true);
    setListing(null);
    try {
      const result = await generateListing({ productIdea });
      setListing(result);
    } catch (error) {
      console.error("Failed to generate listing:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate the listing at this time. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (textToCopy: string, fieldName: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: `${fieldName} copied to clipboard.`,
    });
  };

  const handleCopyAllTags = () => {
    if (listing?.tags) {
      const allTags = listing.tags.join(', ');
      navigator.clipboard.writeText(allTags);
      toast({
        title: "All Tags Copied!",
        description: "All tags copied to clipboard, ready to paste.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Product Idea</CardTitle>
          <CardDescription>
            Enter a few words or a sentence about your product, and let AI do the heavy lifting of writing your listing copy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="product-idea">Product Idea</Label>
            <Textarea
              id="product-idea"
              placeholder="e.g., 'A set of 4 ceramic coasters with a minimalist mountain design, glazed in blue and white.'"
              value={productIdea}
              onChange={(e) => setProductIdea(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateListing} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Listing
          </Button>
        </CardFooter>
      </Card>
      
      {isLoading && <ListingSkeleton />}

      {listing && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Title</CardTitle>
              <CardDescription>A catchy and SEO-friendly title for your listing.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input readOnly value={listing.title} className="bg-secondary/50" />
                <Button variant="outline" size="icon" onClick={() => handleCopy(listing.title, 'Title')}>
                    <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Description</CardTitle>
              <CardDescription>A persuasive description to attract buyers.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="relative">
                    <Textarea
                        readOnly
                        value={listing.description}
                        rows={10}
                        className="bg-secondary/50 whitespace-pre-wrap"
                    />
                    <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={() => handleCopy(listing.description, 'Description')}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Generated Tags</CardTitle>
                  <CardDescription>Click a tag to copy it, or copy all at once.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyAllTags}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-base cursor-pointer hover:bg-primary/20"
                    onClick={() => handleCopy(tag, 'Tag')}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


function ListingSkeleton() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-6 w-24 rounded-full" />)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
