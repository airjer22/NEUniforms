"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EditInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: {
    id: string;
    uniform_type: string;
    total_quantity: number;
    available_quantity: number;
  };
  onInventoryEdited: () => void;
}

export function EditInventoryDialog({
  open,
  onOpenChange,
  inventory,
  onInventoryEdited,
}: EditInventoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    uniformType: inventory.uniform_type,
    totalQuantity: inventory.total_quantity.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTotalQuantity = parseInt(formData.totalQuantity);
      const quantityDifference = newTotalQuantity - inventory.total_quantity;
      const newAvailableQuantity = inventory.available_quantity + quantityDifference;

      if (newAvailableQuantity < 0) {
        throw new Error("Cannot reduce total quantity below number of uniforms currently on loan");
      }

      const { error } = await supabase
        .from('inventory')
        .update({
          uniform_type: formData.uniformType,
          total_quantity: newTotalQuantity,
          available_quantity: newAvailableQuantity,
        })
        .eq('id', inventory.id);

      if (error) throw error;

      toast.success("Inventory updated successfully");
      onInventoryEdited();
    } catch (error: any) {
      toast.error(error.message || "Failed to update inventory");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Uniform</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Uniform Type</Label>
            <Input
              value={formData.uniformType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, uniformType: e.target.value }))
              }
              placeholder="Enter uniform type"
            />
          </div>

          <div className="space-y-2">
            <Label>Total Quantity</Label>
            <Input
              type="number"
              min={inventory.total_quantity - inventory.available_quantity}
              value={formData.totalQuantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, totalQuantity: e.target.value }))
              }
              placeholder="Enter total quantity"
            />
            <p className="text-sm text-muted-foreground">
              Currently on loan: {inventory.total_quantity - inventory.available_quantity}
            </p>
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
                !formData.totalQuantity ||
                parseInt(formData.totalQuantity) < (inventory.total_quantity - inventory.available_quantity)
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Uniform"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}