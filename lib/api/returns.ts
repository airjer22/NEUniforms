import { supabase } from '../supabase';
import { toast } from 'sonner';

export type ReturnCondition = {
  status: 'good' | 'damaged' | 'needs-cleaning';
  notes: string;
  requiresInspection?: boolean;
};

export type ReturnSubmission = {
  transactionId: string;
  returnDate: Date;
  condition: ReturnCondition;
  processorNotes?: string;
};

export async function processUniformReturn(submission: ReturnSubmission) {
  const { transactionId, returnDate, condition } = submission;

  try {
    // Start a Supabase transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*, inventory:inventory_id(*)')
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      throw new Error('Failed to fetch transaction details');
    }

    if (transaction.status === 'returned') {
      throw new Error('This uniform has already been returned');
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'returned',
        actual_return_date: returnDate.toISOString(),
        return_condition: condition.status,
        return_notes: condition.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    if (updateError) {
      throw new Error('Failed to update transaction status');
    }

    // Update inventory quantities
    const { error: inventoryError } = await supabase
      .from('inventory')
      .update({
        available_quantity: transaction.inventory.available_quantity + transaction.quantity
      })
      .eq('id', transaction.inventory_id);

    if (inventoryError) {
      throw new Error('Failed to update inventory quantities');
    }

    // If condition requires inspection, create maintenance record
    if (condition.requiresInspection || condition.status !== 'good') {
      const { error: maintenanceError } = await supabase
        .from('maintenance_queue')
        .insert({
          inventory_id: transaction.inventory_id,
          quantity: transaction.quantity,
          condition_status: condition.status,
          notes: condition.notes,
          priority: condition.status === 'damaged' ? 'high' : 'normal'
        });

      if (maintenanceError) {
        console.error('Failed to create maintenance record:', maintenanceError);
        // Don't throw here - we still completed the return successfully
      }
    }

    return {
      success: true,
      transaction: transaction.id,
      inventory: transaction.inventory_id
    };

  } catch (error: any) {
    console.error('Return processing error:', error);
    throw new Error(error.message || 'Failed to process return');
  }
}