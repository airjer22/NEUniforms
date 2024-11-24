"use client";

import { useState } from "react";
import { BorrowingStepper } from "@/components/borrowing/borrowing-stepper";
import { UniformTypeSelection } from "@/components/borrowing/uniform-type-selection";
import { BorrowerDetails } from "@/components/borrowing/borrower-details";
import { BorrowingConfirmation } from "@/components/borrowing/borrowing-confirmation";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BorrowPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    uniformType: "",
    sport: "",
    gender: "",
    name: "",
    email: "",
    school: "",
    quantity: 1,
    returnDate: new Date(),
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        
        <Card className="p-6">
          <BorrowingStepper currentStep={step} />
          
          <div className="mt-8">
            {step === 1 && (
              <UniformTypeSelection
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
              />
            )}
            {step === 2 && (
              <BorrowerDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {step === 3 && (
              <BorrowingConfirmation
                formData={formData}
                onPrev={prevStep}
              />
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}