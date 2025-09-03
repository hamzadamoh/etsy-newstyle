import { ShopTracker } from "@/components/shop-tracker";

export default function ShopTrackerPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Shop Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your competitors' shops over time to spot trends and changes.
        </p>
      </header>
      <ShopTracker />
    </div>
  );
}
