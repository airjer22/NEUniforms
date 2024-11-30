"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { uniformTypes } from "@/lib/uniform-types";
import { schools } from "@/lib/schools";
import { sports } from "@/lib/uniform-types";
import { Transaction } from "@/lib/types/transaction";

interface TransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getUniformTypeName(type: string): string {
  return uniformTypes.find(u => u.id === type)?.name || type;
}

function getSchoolName(value: string): string {
  return schools.find(school => school.value === value)?.label || value;
}

function getSportName(value: string): string {
  return sports.find(sport => sport.value === value)?.label || value;
}

function formatGender(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function TransactionDialog({ transaction, open, onOpenChange }: TransactionDialogProps) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Transaction ID: {transaction.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Borrower Information</h3>
              <div className="space-y-1">
                <p><span className="text-muted-foreground">Name:</span> {transaction.borrower_name}</p>
                <p><span className="text-muted-foreground">Email:</span> {transaction.borrower_email}</p>
                <p><span className="text-muted-foreground">School:</span> {getSchoolName(transaction.school)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Uniform Details</h3>
              <div className="space-y-1">
                <p><span className="text-muted-foreground">Type:</span> {getUniformTypeName(transaction.inventory.uniform_type)}</p>
                <p><span className="text-muted-foreground">Sport:</span> {getSportName(transaction.sport)}</p>
                <p><span className="text-muted-foreground">Gender:</span> {formatGender(transaction.gender)}</p>
                <p><span className="text-muted-foreground">Quantity:</span> {transaction.quantity}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Transaction Status</h3>
              <div className="space-y-1">
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      transaction.status === "active"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                        : transaction.status === "returned"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-200"
                        : "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </p>
                <p><span className="text-muted-foreground">Created:</span> {format(new Date(transaction.created_at), "PPp")}</p>
                <p><span className="text-muted-foreground">Expected Return:</span> {format(new Date(transaction.expected_return_date), "PPp")}</p>
                {transaction.actual_return_date && (
                  <p><span className="text-muted-foreground">Actual Return:</span> {format(new Date(transaction.actual_return_date), "PPp")}</p>
                )}
              </div>
            </div>

            {transaction.status === "returned" && (
              <div>
                <h3 className="font-semibold mb-2">Return Details</h3>
                <div className="space-y-1">
                  <p>
                    <span className="text-muted-foreground">Condition:</span>{" "}
                    {transaction.return_condition === "no-issues" ? "No Issues" : "Has Issues"}
                  </p>
                  {transaction.return_notes && (
                    <div>
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="mt-1 text-sm whitespace-pre-wrap">{transaction.return_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}