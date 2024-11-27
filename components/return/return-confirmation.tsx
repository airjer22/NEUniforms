"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { BorrowingRecord } from "@/app/return/page";
import { schools } from "@/lib/schools";
import { processReturn } from "@/lib/api";

interface ReturnConfirmationProps {
  borrowing: BorrowingRecord;
  condition: {
    status: string;
    notes: string;
    requiresInspection?: boolean;
  };
  onPrev: () => void;
}

export function ReturnConfirmation({
  borrowing,
  condition,
  onPrev,
}: ReturnConfirmationProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSchoolName = (value: string) => {
    return schools.find(school => school.value === value)?.label || value;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await processReturn(borrowing.id, condition);
      toast.success("Uniform return processed successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to process return");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Confirm Return</h3>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Borrower</div>
              <div className="font-medium">{borrowing.borrowerName}</div>
              <div className="text-sm">{borrowing.borrowerEmail}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">School</div>
              <div className="font-medium">{getSchoolName(borrowing.school)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Uniform</div>
              <div className="font-medium">
                {borrowing.uniformType} ({borrowing.sport})
              </div>
              <div className="text-sm">Quantity: {borrowing.quantity}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Return Status</div>
              <div className="font-medium">
                {condition.status === "no-issues" ? "No Issues" : "Has Issues"}
              </div>
            </div>
          </div>

          {condition.notes && (
            <div>
              <div className="text-sm text-muted-foreground">Additional Notes</div>
              <div className="mt-1 text-sm">{condition.notes}</div>
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          {isSubmitting ? "Processing..." : "Confirm Return"}
        </Button>
      </div>
    </div>
  );
}