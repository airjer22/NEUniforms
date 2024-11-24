"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SearchIcon, Loader2 } from "lucide-react";
import { BorrowingRecord } from "@/app/return/page";
import { schools } from "@/lib/schools";
import { searchBorrowings } from "@/lib/api";
import { toast } from "sonner";

interface BorrowerSearchProps {
  onSelect: (borrowing: BorrowingRecord) => void;
  onNext: () => void;
  selected: BorrowingRecord | null;
}

export function BorrowerSearch({ onSelect, onNext, selected }: BorrowerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BorrowingRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);

    try {
      const results = await searchBorrowings(searchQuery);
      setSearchResults(results.map(result => ({
        id: result.id,
        uniformType: result.inventory.uniform_type,
        sport: result.inventory.sport,
        borrowerName: result.borrower_name,
        borrowerEmail: result.borrower_email,
        school: result.school,
        quantity: result.quantity,
        borrowDate: new Date(result.created_at),
        expectedReturnDate: new Date(result.expected_return_date),
      })));
    } catch (error: any) {
      toast.error(error.message || "Failed to search borrowings");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getSchoolName = (value: string) => {
    return schools.find(school => school.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search by Name or Email</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter borrower's name or email"
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching || !searchQuery}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </div>
        </div>
      </form>

      {hasSearched && (
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active borrowings found for this search.
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((borrowing) => (
                <Card
                  key={borrowing.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selected?.id === borrowing.id
                      ? "border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => onSelect(borrowing)}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Borrower</div>
                      <div className="font-medium">{borrowing.borrowerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {borrowing.borrowerEmail}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">School</div>
                      <div className="font-medium">
                        {getSchoolName(borrowing.school)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Uniform</div>
                      <div className="font-medium">
                        {borrowing.uniformType} ({borrowing.sport})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Quantity: {borrowing.quantity}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Expected Return
                      </div>
                      <div className="font-medium">
                        {borrowing.expectedReturnDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selected}>
          Next Step
        </Button>
      </div>
    </div>
  );
}