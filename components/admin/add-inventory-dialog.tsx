"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uniformTypes } from "@/lib/uniform-types";
import { addInventory } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInventoryAdded: () => void;
}

export function AddInventoryDialog({
  open,
  onOpenChange,
  onInventoryAdded,
}: AddInventoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    uniformType: "",
    quantity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addInventory({
        uniformType: formData.uniformType,
        quantity: parseInt(formData.quantity),
      });

      toast.success("Inventory added successfully");
      onInventoryAdded();
      setFormData({
        uniformType: "",
        quantity: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add inventory");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Uniforms</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Uniform Type</Label>
            <Select
              value={formData.uniformType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, uniformType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select uniform type" />
              </SelectTrigger>
              <SelectContent>
                {uniformTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: e.target.value }))
              }
              placeholder="Enter quantity"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.uniformType ||
                !formData.quantity
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Uniforms"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}