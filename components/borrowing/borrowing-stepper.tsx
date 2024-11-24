import { CheckIcon } from "lucide-react";

interface BorrowingStepperProps {
  currentStep: number;
}

export function BorrowingStepper({ currentStep }: BorrowingStepperProps) {
  const steps = [
    "Select Uniform",
    "Borrower Details",
    "Confirmation",
  ];

  return (
    <div className="relative">
      <div className="absolute top-4 w-full h-0.5 bg-muted" />
      <ol className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={step} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted ? "bg-primary text-primary-foreground" : 
                    isCurrent ? "bg-primary text-primary-foreground" : 
                    "bg-muted text-muted-foreground"}`}
              >
                {isCompleted ? <CheckIcon className="h-4 w-4" /> : stepNumber}
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}