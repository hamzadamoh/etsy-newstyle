"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { trackShop, getTrackedShops, getShopSnapshots, refreshShopData } from "@/app/actions";
import type { TrackedShop, ShopSnapshot } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { ShopTrackerChart } from "./shop-tracker-chart";
import { Loader2, BarChart, PlusCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/auth-context";

const initialTrackState = { success: false, message: "" };

export function ShopTracker() {
  const [trackState, trackFormAction, isTrackingPending] = useActionState(trackShop, initialTrackState);
  const [trackedShops, setTrackedShops] = useState<TrackedShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<TrackedShop | null>(null);
  const [snapshotData, setSnapshotData] = useState<ShopSnapshot[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(true);
  const [isLoadingSnapshots, setIsLoadingSnapshots] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const fetchTrackedShops = async () => {
    setIsLoadingShops(true);
    const shops = await getTrackedShops();
    setTrackedShops(shops);
    setIsLoadingShops(false);
  };

  useEffect(() => {
    if (user) {
        fetchTrackedShops();
    }
  }, [user]);

  useEffect(() => {
    if (trackState.message) {
      toast({
        variant: trackState.success ? "default" : "destructive",
        title: trackState.success ? "Success" : "Error",
        description: trackState.message,
      });
      if (trackState.success) {
        fetchTrackedShops();
      }
    }
  }, [trackState, toast]);

  const handleSelectShop = async (shop: TrackedShop) => {
    setSelectedShop(shop);
    setIsLoadingSnapshots(true);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastUpdated = new Date(shop.last_updated);
    
    const isStale = lastUpdated < today;

    if (isStale) {
        toast({ title: "Data is from yesterday, refreshing..." });
        await refreshShopData(shop.id, shop.shop_id);
    }
    
    const snapshots = await getShopSnapshots(shop.id);
    setSnapshotData(snapshots);
    setIsLoadingSnapshots(false);
    if(isStale) fetchTrackedShops();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <form action={trackFormAction}>
            <CardHeader>
              <CardTitle>Track a New Shop</CardTitle>
              <CardDescription>Enter a shop name to start monitoring its daily stats.</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="store">Shop Name</Label>
              <Input id="store" name="store" placeholder="e.g., YourCompetitor" required disabled={isTrackingPending} />
            </CardContent>
            <CardFooter>
              <SubmitButton className="w-full">
                <PlusCircle className="mr-2"/>
                Track Shop
              </SubmitButton>
            </CardFooter>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tracked Shops</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingShops ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : trackedShops.length > 0 ? (
              <ul className="space-y-2">
                {trackedShops.map((shop) => (
                  <li key={shop.id}>
                    <button 
                      onClick={() => handleSelectShop(shop)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors",
                        selectedShop?.id === shop.id ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                      )}
                    >
                      {shop.icon_url_fullxfull ? (
                        <Image
                          src={shop.icon_url_fullxfull}
                          width={32}
                          height={32}
                          alt={`${shop.shop_name} icon`}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          {shop.shop_name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium truncate">{shop.shop_name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">You are not tracking any shops yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        {isLoadingSnapshots ? (
           <Card className="h-[436px] flex items-center justify-center">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           </Card>
        ) : selectedShop ? (
          <ShopTrackerChart data={snapshotData} shopName={selectedShop.shop_name} />
        ) : (
           <Card className="h-[436px] flex flex-col items-center justify-center text-center">
              <CardContent>
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Select a Shop</h3>
                <p className="text-muted-foreground mt-1">Select a shop from the list to view its tracking data.</p>
              </CardContent>
           </Card>
        )}
      </div>
    </div>
  );
}
