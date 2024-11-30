"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { getTransactionHistory } from "@/lib/api";
import { toast } from "sonner";
import { TransactionDialog } from "./transaction-dialog";
import { Transaction } from "@/lib/types/transaction";
import { uniformTypes } from "@/lib/uniform-types";
import { schools } from "@/lib/schools";

function getUniformTypeName(type: string): string {
  return uniformTypes.find(u => u.id === type)?.name || type;
}

function getSchoolName(value: string): string {
  return schools.find(school => school.value === value)?.label || value;
}

export function TransactionList() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getTransactionHistory();
      setTransactions(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.borrower_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.inventory.uniform_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View and manage uniform borrowing transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="search">Search Transactions</Label>
          <Input
            id="search"
            placeholder="Search by name, uniform type, or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Uniform</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setIsDialogOpen(true);
                  }}
                >
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>{getUniformTypeName(transaction.inventory.uniform_type)}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{transaction.borrower_name}</TableCell>
                  <TableCell>{getSchoolName(transaction.school)}</TableCell>
                  <TableCell>{format(new Date(transaction.created_at), "PP")}</TableCell>
                  <TableCell>
                    {transaction.actual_return_date
                      ? format(new Date(transaction.actual_return_date), "PP")
                      : format(new Date(transaction.expected_return_date), "PP")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.status === 'active'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                          : transaction.status === 'returned' && transaction.return_condition === 'has-issues'
                          ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200'
                          : transaction.status === 'returned'
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-200'
                          : 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200'
                      }`}
                    >
                      {transaction.status === 'returned' && transaction.return_condition === 'has-issues'
                        ? 'Returned (Issues)' 
                        : transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TransactionDialog
          transaction={selectedTransaction}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </CardContent>
    </Card>
  );
}