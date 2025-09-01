import { KeywordResearch } from "@/components/keyword-research";

export default function KeywordResearchPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Keyword Research</h1>
        <p className="text-muted-foreground mt-1">
          Discover and evaluate the potential of keywords to find profitable niches.
        </p>
      </header>
      <KeywordResearch />
    </div>
  );
}
