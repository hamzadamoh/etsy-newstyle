import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { differenceInDays, formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import type { EtsyListing, Filters } from "@/lib/types";

interface ListingsTableProps {
  listings: EtsyListing[];
  filters: Filters;
}

export function ListingsTable({ listings, filters }: ListingsTableProps) {
  const now = new Date();

  const getCellClass = (isMatch: boolean) => cn(isMatch && "bg-accent/20 font-bold");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Listings</CardTitle>
        <CardDescription>
          Showing all {listings.length} active listings. Cells highlighted in plum meet your filter criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing ID</TableHead>
                <TableHead>Favorites</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => {
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
