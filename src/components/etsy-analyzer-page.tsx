"use client";

import { useEffect, useState, useRef, useActionState } from "react";
import { getEtsyShopData, type SingleShopActionState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { ShopInfo } from "@/components/shop-info";
import { ListingsTable } from "@/components/listings-table";
import { ProductTimelineChart } from "@/components/product-timeline-chart";
import type { Filters, EtsyListing } from "@/lib/types";
import { FinancialInsights } from "./financial-insights";

const initialState: SingleShopActionState = {
  shop: null,
  listings: [],
  error: null,
};

export function EtsyAnalyzerPage() {
  const [state, formAction] = useActionState(getEtsyShopData, initialState);
  const [filters, setFilters] = useState<Filters>({ favorites: 5, age: 30, views: 5 });
  const [filteredListings, setFilteredListings] = useState<EtsyListing[]>([]);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state.error, toast]);
  
  useEffect(() => {
    if (state.listings && state.listings.length > 0) {
      const now = new Date();
      const filtered = state.listings.filter(listing => {
        const ageInDays = (now.getTime() - listing.original_creation_timestamp * 1000) / (1000 * 3600 * 24);
        return listing.num_favorers >= filters.favorites &&
               ageInDays <= filters.age &&
               listing.views >= filters.views;
      });
      setFilteredListings(filtered);
    } else {
      setFilteredListings([]);
    }
  }, [state.listings, filters]);

  const handleFormSubmit = (formData: FormData) => {
    const newFilters = {
      favorites: Number(formData.get("filterfav")) || 5,
      age: Number(formData.get("age")) || 30,
      views: Number(formData.get("view")) || 5,
    };
    setFilters(newFilters);
    formAction(formData);
  };

  const handlePrint = () => {
    const printContent = resultsRef.current?.innerHTML;
    if (printContent) {
      const printWindow = window.open("", "", "height=800,width=1200");
      if (printWindow) {
        printWindow.document.write(`<html><head><title>Etsy Store Report for ${state.shop?.shop_name || ''}</title>`);
        const styles = Array.from(document.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join('');
            } catch (e) {
              console.log('Access to stylesheet %s is denied. Ignoring...', styleSheet.href);
            }
          })
          .filter(Boolean)
          .join('\n');
        
        printWindow.document.write(`<style>
          body { font-family: 'Inter', sans-serif; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
          th { background-color: #f2f2f2; }
          .bg-accent\\/20 { background-color: rgba(221, 160, 221, 0.2); }
          .font-bold { font-weight: 700; }
        </style>`);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };


  return (
    <div className="max-w-7xl mx-auto">
      <Card className="no-print">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>Store Analyzer</CardTitle>
            <CardDescription>
              Enter an Etsy store name and set your filters to see the analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="store">Store Name</Label>
              <Input id="store" name="store" placeholder="e.g., YourFavoriteShop" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterfav">Min. Favorites</Label>
              <Input id="filterfav" name="filterfav" type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Max. Age (days)</Label>
              <Input id="age" name="age" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="view">Min. Views</Label>
              <Input id="view" name="view" type="number" defaultValue="5" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
             {state.shop && <Button type="button" variant="outline" onClick={handlePrint}>Download PDF</Button>}
            <SubmitButton>Analyze Store</SubmitButton>
          </CardFooter>
        </form>
      </Card>

      {state.shop && (
         <div ref={resultsRef} className="mt-8 space-y-8">
           <ShopInfo shop={state.shop} />
           {state.listings.length > 0 ? (
            <>
              <FinancialInsights shop={state.shop} listings={state.listings} />
              <ProductTimelineChart listings={state.listings} />
              <ListingsTable listings={state.listings} filters={filters} />
            </>
           ) : (
             <Card>
                <CardHeader>
                    <CardTitle>No Listings Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This shop does not appear to have any active listings.</p>
                </CardContent>
             </Card>
           )}
         </div>
      )}
    </div>
  );
}
