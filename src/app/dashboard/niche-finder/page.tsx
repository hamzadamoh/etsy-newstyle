import { NicheFinder } from '@/components/niche-finder';

export default function NicheFinderPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Niche Finder</h1>
        <p className="text-muted-foreground mt-1">
          Identify emerging trends and popular product categories with the help of AI.
        </p>
      </header>
      <NicheFinder />
    </div>
  );
}
