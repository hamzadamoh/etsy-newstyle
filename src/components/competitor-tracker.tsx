"use client";

import { useActionState, useEffect } from "react";
import { getCompetitorData, type MultiShopActionState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Package, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

const initialState: MultiShopActionState = {
  shops: [],
  errors: [],
};

export function CompetitorTracker() {
  const [state, formAction] = useActionState(getCompetitorData, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.errors.join("\n"),
      });
    }
  }, [state.errors, toast]);

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Track Competitors</CardTitle>
            <CardDescription>
              Enter a list of Etsy shop names separated by commas to compare their key metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="stores">Shop Names</Label>
              <Input 
                id="stores" 
                name="stores" 
                placeholder="e.g., ShopA, ShopB, AnotherShop" 
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton>Track Shops</SubmitButton>
          </CardFooter>
        </form>
      </Card>

      {state.shops.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Competitor Comparison</CardTitle>
            <CardDescription>
              Here's a side-by-side look at the shops you're tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Shop</TableHead>
                    <TableHead className="text-right">Total Sales</TableHead>
                    <TableHead className="text-right">Followers</TableHead>
                    <TableHead className="text-right">Active Listings</TableHead>
                    <TableHead>Link</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {state.shops.map((shop) => (
                    <TableRow key={shop.shop_id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                {shop.icon_url_fullxfull && (
                                    <Image
                                        src={shop.icon_url_fullxfull}
                                        width={32}
                                        height={32}
                                        alt={`${shop.shop_name} icon`}
                                        className="rounded-full"
                                        data-ai-hint="logo"
                                    />
                                )}
                                <span>{shop.shop_name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-1">
                             <ShoppingCart className="h-4 w-4 text-muted-foreground" /> 
                             {shop.transaction_sold_count.toLocaleString()}
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-1">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            {shop.num_favorers.toLocaleString()}
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                {shop.listing_active_count.toLocaleString()}
                            </div>
                        </TableCell>
                        <TableCell>
                            <a href={shop.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
