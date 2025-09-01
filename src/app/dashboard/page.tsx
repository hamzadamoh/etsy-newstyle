import { EtsyAnalyzerPage } from '@/components/etsy-analyzer-page';

export default function ShopAnalyzerDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Shop Analyzer</h1>
        <p className="text-muted-foreground mt-1">
          Perform a deep-dive analysis of a single Etsy shop.
        </p>
      </header>
      <EtsyAnalyzerPage />
    </div>
  );
}
