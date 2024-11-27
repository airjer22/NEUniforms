"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BorrowingRecord } from "@/app/return/page";
import { ReturnCondition } from "@/lib/api/returns";

interface UniformConditionProps {
  borrowing: BorrowingRecord;
  condition: ReturnCondition;
  setCondition: (condition: ReturnCondition) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function UniformCondition({
  borrowing,
  condition,
  setCondition,
  onNext,
  onPrev,
}: UniformConditionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (condition.status) {
      onNext();
    }
  };

  const handleStatusChange = (value: string) => {
    setCondition({
      status: value as 'no-issues' | 'has-issues',
      notes: value === "no-issues" ? "" : condition.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base">Return Issues</Label>
          <RadioGroup
            className="grid gap-4 mt-2"
            value={condition.status}
            onValueChange={handleStatusChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no-issues" id="no-issues" />
              <Label htmlFor="no-issues">Returning without issues</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="has-issues" id="has-issues" />
              <Label htmlFor="has-issues">Returning with issues</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Please describe any issues with the uniform..."
            value={condition.notes}
            onChange={(e) =>
              setCondition({ ...condition, notes: e.target.value })
            }
            className="min-h-[100px]"
            disabled={condition.status === "no-issues"}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button 
          type="submit" 
          disabled={!condition.status || (condition.status === "has-issues" && !condition.notes)}
        >
          Next Step
        </Button>
      </div>
    </form>
  );
}