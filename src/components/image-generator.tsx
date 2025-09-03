"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { generateImage } from "@/ai/flows/image-generator-flow";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Wand2, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt to generate an image.",
      });
      return;
    }
    setIsLoading(true);
    setImageUrl(null);
    try {
      const result = await generateImage({ 
        prompt,
        negativePrompt,
        aspectRatio,
       });
      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate the image at this time. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
       toast({
        title: "Image downloading!",
      });
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Describe the Image You Want</CardTitle>
          <CardDescription>
            Be as descriptive as possible for the best results. Think about style, colors, and composition.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label htmlFor="image-prompt">Image Prompt</Label>
              <Textarea
                id="image-prompt"
                placeholder="e.g., 'A cinematic, professional product photograph of a handmade ceramic mug on a rustic wooden table, soft morning light.'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>
             <div className="space-y-2">
                <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isLoading}>
                    <SelectTrigger id="aspect-ratio">
                        <SelectValue placeholder="Select ratio..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1:1">Square (1:1)</SelectItem>
                        <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                        <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
              <Input
                id="negative-prompt"
                placeholder="e.g., 'text, watermark, blurry, extra fingers'"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                disabled={isLoading}
              />
            </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateImage} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Image
          </Button>
        </CardFooter>
      </Card>
      
      {isLoading && (
        <Card>
            <CardHeader>
                <CardTitle>Generating Your Image...</CardTitle>
                <CardDescription>This can take up to 30 seconds. Please be patient.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                 <Skeleton className="w-full h-[512px] rounded-lg" />
            </CardContent>
        </Card>
      )}

      {imageUrl && (
        <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Generated Image</CardTitle>
                  <CardDescription>You can now download your new image.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Image
                    src={imageUrl}
                    alt={prompt}
                    width={512}
                    height={512}
                    className="rounded-lg border object-contain"
                    style={{
                        aspectRatio: aspectRatio.replace(':', ' / ')
                    }}
                    data-ai-hint="generated image"
                />
            </CardContent>
        </Card>
      )}
       {!imageUrl && !isLoading && (
         <Card className="border-dashed">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4" />
                <p>Your generated image will appear here.</p>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
