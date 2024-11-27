"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DeleteInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: {
    id: string;
    uniform_type: string;
    total_quantity: number;
    available_quantity: number;
  };
  onInventoryDeleted: () => void;
}

export function DeleteInventoryDialog({
  open,
  onOpenChange,
  inventory,
  onInventoryDeleted,
}: DeleteInventoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      // Check if there are any active loans
      if (inventory.total_quantity !== inventory.available_quantity) {
        throw new Error("Cannot delete uniform type with active loans");
      }

      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', inventory.id);

      if (error) throw error;

      toast.success("Uniform type deleted successfully");
      onInventoryDeleted();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete uniform type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Uniform Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {inventory.uniform_type}? This action cannot be undone.
            {inventory.total_quantity !== inventory.available_quantity && (
              <p className="mt-2 text-destructive">
                Warning: This uniform type has active loans and cannot be deleted.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting || inventory.total_quantity !== inventory.available_quantity}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Uniform"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}