import { ImageGenerator } from "@/components/image-generator";

export default function ImageGeneratorPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">AI Image Generator</h1>
        <p className="text-muted-foreground mt-1">
          Create stunning visuals for your products or marketing from a simple text description.
        </p>
      </header>
      <ImageGenerator />
    </div>
  );
}
