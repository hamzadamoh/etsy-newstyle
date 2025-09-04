
"use client"

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { ArrowUpDown, Search, Heart, Columns, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { EtsyListing } from "@/lib/types";


interface TopListingsTableProps {
    listings: EtsyListing[];
    count: number;
}

type AugmentedEtsyListing = EtsyListing & {
    image_url: string;
    monthly_sales: number;
    sales: number;
    revenue: number;
    lqs: number;
    price: number;
    sales_trend: { y: number }[];
};

type SortKey = "title" | "monthly_sales" | "sales" | "revenue" | "lqs" | "price";
type SortDirection = "asc" | "desc";

// Function to generate a plausible sales trend
const generateSalesTrend = () => {
  const data = [];
  let lastY = Math.random() * 50 + 25;
  for (let i = 0; i < 10; i++) {
    const newY = lastY + (Math.random() * 20 - 10);
    data.push({ y: Math.max(0, Math.min(100, newY)) });
    lastY = newY;
  }
  return data;
};

// Augment listings with placeholder data
const augmentListingsData = (listings: EtsyListing[]): AugmentedEtsyListing[] => {
    return listings.map(listing => {
        const sales = listing.num_favorers * (Math.floor(Math.random() * 5) + 1);
        const price = parseFloat((Math.random() * 50 + 5).toFixed(2));
        const revenue = sales * price;
        const monthlySales = Math.floor(sales / (Math.random() * 3 + 1));
        
        return {
            ...listing,
            image_url: `https://picsum.photos/seed/${listing.listing_id}/40/40`,
            monthly_sales: monthlySales,
            sales: sales,
            revenue: revenue,
            lqs: Math.floor(Math.random() * 30) + 70, // Listing Quality Score
            price: price,
            sales_trend: generateSalesTrend()
        }
    });
};


export function TopListingsTable({ listings, count }: TopListingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("monthly_sales");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { toast } = useToast();
  
  const [augmentedListings, setAugmentedListings] = useState<AugmentedEtsyListing[]>([]);
  const [filter, setFilter] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    monthly_sales: true,
    sales: true,
    sales_trend: true,
    revenue: true,
    lqs: true,
    price: true,
  });

  useEffect(() => {
    // Generate augmented data on the client side to avoid hydration mismatch
    setAugmentedListings(augmentListingsData(listings));
  }, [listings]);
  
  const filteredAndSortedListings = useMemo(() => {
    let result = [...augmentedListings];

    if (filter) {
      result = result.filter(listing =>
        listing.title.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [augmentedListings, sortKey, sortDirection, filter]);


  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    const headers = ["Title", "Monthly Sales", "Total Sales", "Revenue", "LQS", "Price", "URL"];
    const rows = filteredAndSortedListings.map(l => [
        `"${l.title.replace(/"/g, '""')}"`,
        l.monthly_sales,
        l.sales,
        l.revenue,
        l.lqs,
        l.price,
        l.url
    ].join(','));
    const csv = `${headers.join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'top-listings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Exporting CSV...", description: "Your download will start shortly."});
  };
  
  const SortableHeader = ({ sortKey: key, children, className }: { sortKey: SortKey; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
      <Button variant="ghost" onClick={() => handleSort(key)} className="px-2 py-1 h-auto -ml-2">
        {children}
        <ArrowUpDown className={cn("ml-2 h-3 w-3", sortKey === key ? "text-foreground" : "text-muted-foreground/50")} />
      </Button>
    </TableHead>
  );
  
  if (augmentedListings.length === 0) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>Top listings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-8">Loading listings data...</div>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <CardTitle>Top listings</CardTitle>
                    <Badge variant="secondary">{count.toLocaleString()} listings</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search listings..." 
                            className="pl-8 w-40 sm:w-64"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Columns className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {Object.entries(visibleColumns).map(([key, value]) => (
                                <DropdownMenuCheckboxItem
                                    key={key}
                                    checked={value}
                                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, [key]: checked }))}
                                >
                                    {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>
        </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead padding="checkbox" className="w-12">
                  <Checkbox />
                </TableHead>
                <SortableHeader sortKey="title" className="min-w-[300px]">Title</SortableHeader>
                {visibleColumns.monthly_sales && <SortableHeader sortKey="monthly_sales">Monthly sales</SortableHeader>}
                {visibleColumns.sales && <SortableHeader sortKey="sales">Sales</SortableHeader>}
                {visibleColumns.sales_trend && <TableHead>Sales trend</TableHead>}
                {visibleColumns.revenue && <SortableHeader sortKey="revenue">Revenue</SortableHeader>}
                {visibleColumns.lqs && 
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <SortableHeader sortKey="lqs">LQS</SortableHeader>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Listing Quality Score</p>
                        </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                }
                {visibleColumns.price && <SortableHeader sortKey="price">Price</SortableHeader>}
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedListings.map((listing) => (
                  <TableRow key={listing.listing_id}>
                    <TableCell padding="checkbox">
                        <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                        <a href={listing.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2" title={listing.title}>
                            <Image src={listing.image_url} alt={listing.title} width={40} height={40} className="rounded-sm" data-ai-hint="product image" />
                            <span className="truncate">{listing.title}</span>
                        </a>
                    </TableCell>
                    {visibleColumns.monthly_sales && <TableCell>{listing.monthly_sales.toLocaleString()}</TableCell>}
                    {visibleColumns.sales && <TableCell>{listing.sales.toLocaleString()}</TableCell>}
                    {visibleColumns.sales_trend && 
                        <TableCell>
                            <div className="w-24 h-8">
                                <ResponsiveContainer>
                                    <LineChart data={listing.sales_trend}>
                                        <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </TableCell>
                    }
                    {visibleColumns.revenue && <TableCell>${listing.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>}
                    {visibleColumns.lqs && 
                        <TableCell>
                            <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-700">{listing.lqs}</Badge>
                        </TableCell>
                    }
                    {visibleColumns.price && <TableCell>${listing.price.toFixed(2)}</TableCell>}
                    <TableCell>
                        <Button variant="ghost" size="icon">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

    