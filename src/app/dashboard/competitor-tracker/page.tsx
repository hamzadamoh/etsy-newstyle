import { CompetitorTracker } from "@/components/competitor-tracker";

export default function CompetitorTrackerPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Competitor Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Monitor a set of key competitors over time by comparing their stats side-by-side.
        </p>
      </header>
      <CompetitorTracker />
    </div>
  );
}
