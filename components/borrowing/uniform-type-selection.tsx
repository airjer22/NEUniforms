"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uniformTypes, sports, genders } from "@/lib/uniform-types";
import { UniformIcon } from "@/components/uniform-icon";
import { cn } from "@/lib/utils";

interface FormData {
  uniformType: string;
  sport: string;
  gender: string;
}

interface UniformTypeSelectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

export function UniformTypeSelection({
  formData,
  updateFormData,
  onNext,
}: UniformTypeSelectionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.uniformType && formData.sport && formData.gender) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <Label className="text-base">Select Uniform Type</Label>
          <RadioGroup
            className="grid grid-cols-2 gap-4 mt-2"
            value={formData.uniformType}
            onValueChange={(value) => updateFormData({ uniformType: value })}
          >
            {uniformTypes.map((type) => (
              <div key={type.id} className="relative">
                <RadioGroupItem
                  value={type.id}
                  id={type.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={type.id}
                  className={cn(
                    "uniform-type-label flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors",
                    formData.uniformType === type.id && "selected"
                  )}
                >
                  <UniformIcon iconName={type.iconName} />
                  <div className="uniform-type-text text-sm font-medium mt-4 transition-colors">
                    {type.name}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sport">Select Sport</Label>
          <Select
            value={formData.sport}
            onValueChange={(value) => updateFormData({ sport: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport.value} value={sport.value}>
                  {sport.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Select Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => updateFormData({ gender: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose gender" />
            </SelectTrigger>
            <SelectContent>
              {genders.map((gender) => (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!formData.uniformType || !formData.sport || !formData.gender}
        >
          Next Step
        </Button>
      </div>
    </form>
  );
}