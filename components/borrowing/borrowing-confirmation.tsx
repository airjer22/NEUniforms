"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { schools } from "@/lib/schools";
import { createBorrowing } from "@/lib/api";

interface BorrowingConfirmationProps {
  formData: {
    uniformType: string;
    sport: string;
    gender: string;
    name: string;
    email: string;
    school: string;
    quantity: number;
    returnDate: Date;
  };
  onPrev: () => void;
}

export function BorrowingConfirmation({
  formData,
  onPrev,
}: BorrowingConfirmationProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSchoolLabel = (value: string) => {
    return schools.find(school => school.value === value)?.label || value;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createBorrowing({
        uniformType: formData.uniformType,
        sport: formData.sport,
        gender: formData.gender,
        borrowerName: formData.name,
        borrowerEmail: formData.email,
        school: formData.school,
        quantity: formData.quantity,
        expectedReturnDate: formData.returnDate,
      });
      
      toast.success("Uniform request submitted successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Review Your Request</h3>
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Uniform Type</div>
              <div className="font-medium">{formData.uniformType}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sport</div>
              <div className="font-medium">{formData.sport}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Gender</div>
              <div className="font-medium">{formData.gender}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{formData.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{formData.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">School</div>
              <div className="font-medium">{getSchoolLabel(formData.school)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Quantity</div>
              <div className="font-medium">{formData.quantity}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Return Date</div>
              <div className="font-medium">
                {formData.returnDate.toLocaleDateString()}
              </div>
            </div>
          </div>
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
          {isSubmitting ? "Submitting..." : "Confirm Request"}
        </Button>
      </div>
    </div>
  );
}