"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateTags } from "@/ai/flows/tag-generator-flow";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Wand2 } from "lucide-react";

export function TagGenerator() {
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateTags = async () => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a product description.",
      });
      return;
    }
    setIsLoading(true);
    setTags([]);
    try {
      const result = await generateTags({ productDescription: description });
      setTags(result.tags);
    } catch (error) {
      console.error("Failed to generate tags:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate tags at this time. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `"${text}" copied to clipboard.`,
    });
  };

  const handleCopyAll = () => {
    const allTags = tags.join(', ');
    navigator.clipboard.writeText(allTags);
    toast({
      title: "All Tags Copied!",
      description: "All tags copied to clipboard, ready to paste.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Generate Tags with AI</CardTitle>
          <CardDescription>
            Enter a description of your product and let our AI generate relevant tags to improve your listing's visibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-description">Product Description</Label>
            <Textarea
              id="product-description"
              placeholder="e.g., 'A beautiful handmade ceramic mug, painted with a floral design. Perfect for coffee or tea.'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateTags} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Tags
          </Button>
        </CardFooter>
      </Card>

      {tags.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Suggested Tags</CardTitle>
                <CardDescription>Click a tag to copy it, or copy all tags at once.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-base cursor-pointer hover:bg-primary/20"
                  onClick={() => handleCopy(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
