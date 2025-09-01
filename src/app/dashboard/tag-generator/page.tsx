import { TagGenerator } from "@/components/tag-generator";

export default function TagGeneratorPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tag Generator</h1>
        <p className="text-muted-foreground mt-1">
          Quickly generate a list of relevant, high-performing tags for your product listings.
        </p>
      </header>
      <TagGenerator />
    </div>
  );
}
