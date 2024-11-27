"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReturnStepper } from "@/components/return/return-stepper";
import { BorrowerSearch } from "@/components/return/borrower-search";
import { UniformCondition } from "@/components/return/uniform-condition";
import { ReturnConfirmation } from "@/components/return/return-confirmation";

import { ReturnCondition } from "@/lib/api/returns";

export type BorrowingRecord = {
  id: string;
  uniformType: string;
  sport: string;
  borrowerName: string;
  borrowerEmail: string;
  school: string;
  quantity: number;
  borrowDate: Date;
  expectedReturnDate: Date;
};

export default function ReturnPage() {
  const [step, setStep] = useState(1);
  const [selectedBorrowing, setSelectedBorrowing] = useState<BorrowingRecord | null>(null);
  const [condition, setCondition] = useState<ReturnCondition>({
    status: "no-issues",
    notes: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <Card className="p-6">
          <ReturnStepper currentStep={step} />

          <div className="mt-8">
            {step === 1 && (
              <BorrowerSearch
                onSelect={setSelectedBorrowing}
                onNext={nextStep}
                selected={selectedBorrowing}
              />
            )}
            {step === 2 && (
              <UniformCondition
                borrowing={selectedBorrowing!}
                condition={condition}
                setCondition={setCondition}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {step === 3 && (
              <ReturnConfirmation
                borrowing={selectedBorrowing!}
                condition={condition}
                onPrev={prevStep}
              />
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}