import { CompetitorTracker } from "@/components/competitor-tracker";

export default function CompetitorTrackerPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Bulk Shop Analyzer</h1>
        <p className="text-muted-foreground mt-1">
          Analyze multiple Etsy shops at once and compare their key metrics side-by-side.
        </p>
      </header>
      <CompetitorTracker />
    </div>
  );
}
