"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { BorrowingRecord } from "@/app/return/page";

interface UniformConditionProps {
  borrowing: BorrowingRecord;
  condition: {
    status: string;
    notes: string;
    requiresInspection?: boolean;
  };
  setCondition: (condition: { status: string; notes: string; requiresInspection?: boolean }) => void;
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
      status: value,
      notes: value === "good" ? "" : condition.notes || "",
      requiresInspection: value !== "good"
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
              <RadioGroupItem value="good" id="good" />
              <Label htmlFor="good">Good condition</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="damaged" id="damaged" />
              <Label htmlFor="damaged">Damaged</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="needs-cleaning" id="needs-cleaning" />
              <Label htmlFor="needs-cleaning">Needs cleaning</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="requires-inspection"
            checked={condition.requiresInspection}
            onCheckedChange={(checked) =>
              setCondition({ ...condition, requiresInspection: !!checked })
            }
          />
          <Label htmlFor="requires-inspection">
            Requires detailed inspection
          </Label>
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
            disabled={condition.status === "good"}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button 
          type="submit" 
          disabled={!condition.status || (condition.status !== "good" && !condition.notes)}
        >
          Next Step
        </Button>
      </div>
    </form>
  );
}