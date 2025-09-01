"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowUpDown } from "lucide-react";
import { differenceInDays, formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import type { EtsyListing, Filters } from "@/lib/types";

interface ListingsTableProps {
  listings: EtsyListing[];
  filters: Filters;
}

type SortKey = "num_favorers" | "views" | "original_creation_timestamp" | "last_modified_timestamp" | "quantity";
type SortDirection = "asc" | "desc";

export function ListingsTable({ listings, filters }: ListingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("num_favorers");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const now = new Date();

  const sortedListings = useMemo(() => {
    const sorted = [...listings].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });
    return sorted;
  }, [listings, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };
  
  const SortableHeader = ({ sortKey: key, children }: { sortKey: SortKey; children: React.ReactNode }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => handleSort(key)} className="px-2 py-1 h-auto -ml-2">
        {children}
        <ArrowUpDown className={cn("ml-2 h-3 w-3", sortKey === key ? "text-foreground" : "text-muted-foreground/50")} />
      </Button>
    </TableHead>
  );

  const getCellClass = (isMatch: boolean) => cn(isMatch && "bg-accent/20 font-bold");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Listings</CardTitle>
        <CardDescription>
          Showing all {listings.length} active listings. Cells highlighted in plum meet your filter criteria. Click headers to sort.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing ID</TableHead>
                <SortableHeader sortKey="num_favorers">Favorites</SortableHeader>
                <SortableHeader sortKey="views">Views</SortableHeader>
                <SortableHeader sortKey="original_creation_timestamp">Age</SortableHeader>
                <SortableHeader sortKey="last_modified_timestamp">Last Modified</SortableHeader>
                <SortableHeader sortKey="quantity">Qty</SortableHeader>
                <TableHead>Tags</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedListings.map((listing) => {
                const ageInDays = differenceInDays(now, new Date(listing.original_creation_timestamp * 1000));
                
                const meetsFavs = listing.num_favorers >= filters.favorites;
                const meetsAge = ageInDays <= filters.age;
                const meetsViews = listing.views >= filters.views;

                return (
                  <TableRow key={listing.listing_id}>
                    <TableCell>{listing.listing_id}</TableCell>
                    <TableCell className={getCellClass(meetsFavs)}>{listing.num_favorers.toLocaleString()}</TableCell>
                    <TableCell className={getCellClass(meetsViews)}>{listing.views.toLocaleString()}</TableCell>
                    <TableCell className={getCellClass(meetsAge)}>
                      {formatDistanceToNowStrict(new Date(listing.original_creation_timestamp * 1000))}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNowStrict(new Date(listing.last_modified_timestamp * 1000), { addSuffix: true })}
                    </TableCell>
                    <TableCell>{listing.quantity}</TableCell>
                    <TableCell>
                       <div className="flex flex-wrap gap-1 max-w-xs">
                        {listing.tags.slice(0, 5).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        {listing.tags.length > 5 && <Badge variant="outline">+{listing.tags.length - 5}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a href={listing.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
