import { ListingGenerator } from "@/components/listing-generator";

export default function ListingGeneratorPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">AI Listing Generator</h1>
        <p className="text-muted-foreground mt-1">
          Create a complete, high-quality Etsy listing from a simple idea in seconds.
        </p>
      </header>
      <ListingGenerator />
    </div>
  );
}
