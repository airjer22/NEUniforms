import { supabase } from '../supabase';
import { toast } from 'sonner';

export type ReturnCondition = {
  status: 'no-issues' | 'has-issues';
  notes: string;
};

export type ReturnSubmission = {
  transactionId: string;
  returnDate: Date;
  condition: ReturnCondition;
  processorNotes?: string;
};

export async function processUniformReturn(submission: ReturnSubmission) {
  const { transactionId, returnDate, condition } = submission;

  console.log('Processing return:', { transactionId, returnDate, condition });

  try {
    // Start a Supabase transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select(`
        *,
        inventory:inventory_id (
          id,
          uniform_type,
          available_quantity
        )
      `)
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      console.error('Fetch error:', fetchError);
      throw new Error('Failed to fetch transaction details');
    }

    console.log('Found transaction:', transaction);

    if (transaction.status === 'returned') {
      throw new Error('This uniform has already been returned');
    }

    // Update transaction status
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'returned',
        actual_return_date: returnDate.toISOString(),
        return_condition: condition.status,
        return_notes: condition.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to update transaction status');
    }

    console.log('Updated transaction:', updatedTransaction);

    // Update inventory quantities
    const newAvailableQuantity = transaction.inventory.available_quantity + transaction.quantity;
    console.log('Updating inventory:', {
      currentQuantity: transaction.inventory.available_quantity,
      returningQuantity: transaction.quantity,
      newQuantity: newAvailableQuantity
    });

    const { data: updatedInventory, error: inventoryError } = await supabase
      .from('inventory')
      .update({
        available_quantity: newAvailableQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.inventory_id)
      .select()
      .single();

    if (inventoryError) {
      console.error('Inventory update error:', inventoryError);
      throw new Error('Failed to update inventory quantities');
    }

    console.log('Updated inventory:', updatedInventory);

    // If condition requires inspection, create maintenance record
    if (condition.status === 'has-issues') {
      const { error: maintenanceError } = await supabase
        .from('maintenance_queue')
        .insert({
          inventory_id: transaction.inventory_id,
          quantity: transaction.quantity,
          condition_status: condition.status,
          notes: condition.notes,
          priority: 'normal'
        });

      if (maintenanceError) {
        console.error('Failed to create maintenance record:', maintenanceError);
        // Don't throw here - we still completed the return successfully
      }
    }

    return {
      success: true,
      transaction: updatedTransaction,
      inventory: transaction.inventory_id
    };

  } catch (error: any) {
    console.error('Return processing error:', error);
    throw new Error(error.message || 'Failed to process return');
  }
}