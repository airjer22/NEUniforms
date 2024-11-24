import { supabase } from './supabase';
import { Database } from './database.types';

type Inventory = Database['public']['Tables']['inventory']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

export async function createBorrowing(data: {
  uniformType: string;
  sport: string;
  gender: string;
  borrowerName: string;
  borrowerEmail: string;
  school: string;
  quantity: number;
  expectedReturnDate: Date;
}) {
  // First, check inventory availability
  const { data: inventory, error: inventoryError } = await supabase
    .from('inventory')
    .select()
    .eq('uniform_type', data.uniformType)
    .single();

  if (inventoryError) {
    throw new Error('Failed to check inventory');
  }

  if (!inventory || inventory.available_quantity < data.quantity) {
    throw new Error('Not enough uniforms available');
  }

  // Create transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      type: 'borrow',
      inventory_id: inventory.id,
      borrower_name: data.borrowerName,
      borrower_email: data.borrowerEmail,
      school: data.school,
      quantity: data.quantity,
      expected_return_date: data.expectedReturnDate.toISOString(),
      status: 'active'
    })
    .select()
    .single();

  if (transactionError) {
    throw transactionError;
  }

  // Update inventory
  const { error: updateError } = await supabase
    .from('inventory')
    .update({
      available_quantity: inventory.available_quantity - data.quantity
    })
    .eq('id', inventory.id);

  if (updateError) {
    throw updateError;
  }

  return transaction;
}

export async function searchBorrowings(query: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      inventory:inventory_id (
        uniform_type
      )
    `)
    .or(`borrower_name.ilike.%${query}%,borrower_email.ilike.%${query}%`)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function processReturn(
  transactionId: string,
  condition: { status: string; notes: string }
) {
  // Get the transaction
  const { data: transaction, error: fetchError } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (fetchError || !transaction) {
    throw new Error('Transaction not found');
  }

  // Update the transaction
  const { error: updateError } = await supabase
    .from('transactions')
    .update({
      status: 'returned',
      return_condition: condition.status,
      return_notes: condition.notes,
      actual_return_date: new Date().toISOString()
    })
    .eq('id', transactionId);

  if (updateError) {
    throw updateError;
  }

  // Update inventory
  const { error: inventoryError } = await supabase
    .from('inventory')
    .update({
      available_quantity: supabase.rpc('increment', { x: transaction.quantity })
    })
    .eq('id', transaction.inventory_id);

  if (inventoryError) {
    throw inventoryError;
  }
}

export async function getInventoryStats() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('uniform_type', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function addInventory(data: {
  uniformType: string;
  quantity: number;
}) {
  // Check if inventory item already exists
  const { data: existing, error: checkError } = await supabase
    .from('inventory')
    .select()
    .eq('uniform_type', data.uniformType)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
    throw checkError;
  }

  if (existing) {
    // Update existing inventory
    const { error: updateError } = await supabase
      .from('inventory')
      .update({
        total_quantity: existing.total_quantity + data.quantity,
        available_quantity: existing.available_quantity + data.quantity,
      })
      .eq('id', existing.id);

    if (updateError) {
      throw updateError;
    }
  } else {
    // Create new inventory item
    const { error: insertError } = await supabase
      .from('inventory')
      .insert({
        uniform_type: data.uniformType,
        total_quantity: data.quantity,
        available_quantity: data.quantity,
      });

    if (insertError) {
      throw insertError;
    }
  }
}