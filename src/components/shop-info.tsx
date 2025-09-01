
"use client";

import Image from "next/image";
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Star, Package, ShoppingCart, Calendar, Shirt, Copy } from "lucide-react";
import type { EtsyShop } from "@/lib/types";

interface ShopInfoProps {
  shop: EtsyShop;
}

const InfoPill = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export function ShopInfo({ shop }: ShopInfoProps) {
  const { toast } = useToast();
  const shopAgeDays = differenceInDays(new Date(), new Date(shop.create_date * 1000));
  const shopAgeFormatted = formatDistanceToNow(new Date(shop.create_date * 1000), { addSuffix: true });
  const isNewShop = shopAgeDays <= 90;

  const handleCopyToSheets = () => {
    const headers = "Total Sales\tActive Listings\tShop Age";
    const values = `${shop.transaction_sold_count}\t${shop.listing_active_count}\t${shopAgeFormatted}`;
    const clipboardText = `${headers}\n${values}`;

    navigator.clipboard.writeText(clipboardText).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "Shop data is ready to be pasted into Google Sheets.",
      });
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy data to clipboard.",
      });
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {shop.icon_url_fullxfull && (
            <Image
              src={shop.icon_url_fullxfull}
              width={64}
              height={64}
              alt={`${shop.shop_name} icon`}
              className="rounded-full border"
              data-ai-hint="logo"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{shop.shop_name}</CardTitle>
              {isNewShop && <Badge variant="destructive">New Store</Badge>}
            </div>
            <a href={shop.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
              Visit Store <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopyToSheets}>
          <Copy className="mr-2 h-4 w-4" />
          Copy to Sheets
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <InfoPill icon={<ShoppingCart className="h-6 w-6" />} label="Total Sales" value={shop.transaction_sold_count.toLocaleString()} />
        <InfoPill icon={<Star className="h-6 w-6" />} label="Shop Followers" value={shop.num_favorers.toLocaleString()} />
        <InfoPill icon={<Package className="h-6 w-6" />} label="Active Listings" value={shop.listing_active_count.toLocaleString()} />
        <InfoPill icon={<Shirt className="h-6 w-6" />} label="Digital Listings" value={shop.digital_listing_count.toLocaleString()} />
        <InfoPill icon={<Calendar className="h-6 w-6" />} label="Shop Age" value={shopAgeFormatted} />
      </CardContent>
    </Card>
  );
}
