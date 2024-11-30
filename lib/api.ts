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
  console.log('Starting borrowing process with data:', data);

  try {
    // Get the current inventory state
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('*')
      .eq('uniform_type', data.uniformType)
      .single();

    console.log('Fetched inventory:', inventory);

    if (inventoryError) {
      console.error('Inventory fetch error:', inventoryError);
      throw new Error('Failed to check inventory');
    }

    if (!inventory) {
      throw new Error('Uniform type not found');
    }

    if (inventory.available_quantity < data.quantity) {
      throw new Error(`Not enough uniforms available. Only ${inventory.available_quantity} in stock.`);
    }

    // Calculate new available quantity
    const newAvailableQuantity = inventory.available_quantity - data.quantity;
    console.log('Calculating new available quantity:', {
      current: inventory.available_quantity,
      requested: data.quantity,
      new: newAvailableQuantity
    });

    // First create the transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        type: 'borrow',
        inventory_id: inventory.id,
        borrower_name: data.borrowerName,
        borrower_email: data.borrowerEmail,
        school: data.school,
        sport: data.sport,
        gender: data.gender,
        quantity: data.quantity,
        expected_return_date: data.expectedReturnDate.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      throw new Error('Failed to create transaction');
    }

    console.log('Successfully created transaction. Updating inventory...');

    // Then update the inventory
    const { error: updateError } = await supabase
      .from('inventory')
      .update({
        available_quantity: newAvailableQuantity
      })
      .eq('id', inventory.id)
      .select()
      .single();

    if (updateError) {
      console.error('Inventory update error:', updateError);
      
      // Rollback the transaction if inventory update fails
      const { error: rollbackError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);

      if (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }

      throw new Error('Failed to update inventory');
    }

    console.log('Borrowing process completed successfully');
    return transaction;
  } catch (error) {
    console.error('Borrowing process failed:', error);
    throw error;
  }
}

export async function searchBorrowings(query: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      inventory:inventory_id (*)
    `)
    .or(`borrower_name.ilike.%${query}%,borrower_email.ilike.%${query}%`)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Search borrowings error:', error);
    throw error;
  }

  return data;
}

export async function processReturn(
  transactionId: string,
  condition: { status: string; notes: string }
) {
  console.log('Starting return process for transaction:', transactionId);

  try {
    // Get the transaction with its related inventory
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select(`
        *,
        inventory:inventory_id (*)
      `)
      .eq('id', transactionId)
      .single();

    if (fetchError) {
      console.error('Transaction fetch error:', fetchError);
      throw new Error('Failed to fetch transaction');
    }

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'returned') {
      throw new Error('This uniform has already been returned');
    }

    console.log('Found transaction:', transaction);

    // Get the current inventory state
    const { data: currentInventory, error: inventoryFetchError } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', transaction.inventory_id)
      .single();

    if (inventoryFetchError || !currentInventory) {
      console.error('Inventory fetch error:', inventoryFetchError);
      throw new Error('Failed to fetch current inventory state');
    }

    console.log('Current inventory state:', currentInventory);

    // Calculate new available quantity
    const newAvailableQuantity = currentInventory.available_quantity + transaction.quantity;
    console.log('Calculating new available quantity:', {
      current: currentInventory.available_quantity,
      returning: transaction.quantity,
      new: newAvailableQuantity
    });

    // First update the transaction
    const { error: transactionUpdateError } = await supabase
      .from('transactions')
      .update({
        status: 'returned',
        return_condition: condition.status,
        return_notes: condition.notes,
        actual_return_date: new Date().toISOString()
      })
      .eq('id', transactionId);

    if (transactionUpdateError) {
      console.error('Transaction update error:', transactionUpdateError);
      throw new Error('Failed to update transaction');
    }

    console.log('Successfully updated transaction. Updating inventory...');

    // Then update the inventory
    const { error: inventoryUpdateError } = await supabase
      .from('inventory')
      .update({
        available_quantity: newAvailableQuantity
      })
      .eq('id', transaction.inventory_id);

    if (inventoryUpdateError) {
      console.error('Inventory update error:', inventoryUpdateError);

      // Rollback transaction update if inventory update fails
      const { error: rollbackError } = await supabase
        .from('transactions')
        .update({
          status: 'active',
          return_condition: null,
          return_notes: null,
          actual_return_date: null
        })
        .eq('id', transactionId);

      if (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }

      throw new Error('Failed to update inventory');
    }

    console.log('Return process completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Return process failed:', error);
    throw error;
  }
}

export async function getInventoryStats() {
  console.log('Fetching inventory stats...');
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('uniform_type', { ascending: true });

  if (error) {
    console.error('Inventory stats error:', error);
    throw error;
  }

  console.log('Inventory stats:', data);
  return data;
}

export async function addInventory(data: {
  uniformType: string;
  quantity: number;
}) {
  console.log('Starting add inventory process:', data);

  try {
    // Check if inventory item exists
    const { data: existing, error: checkError } = await supabase
      .from('inventory')
      .select('*')
      .eq('uniform_type', data.uniformType)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Inventory check error:', checkError);
      throw checkError;
    }

    if (existing) {
      console.log('Updating existing inventory:', existing);
      // Update existing inventory
      const { error: updateError } = await supabase
        .from('inventory')
        .update({
          total_quantity: existing.total_quantity + data.quantity,
          available_quantity: existing.available_quantity + data.quantity
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Inventory update error:', updateError);
        throw updateError;
      }
    } else {
      console.log('Creating new inventory item');
      // Create new inventory item
      const { error: insertError } = await supabase
        .from('inventory')
        .insert({
          uniform_type: data.uniformType,
          total_quantity: data.quantity,
          available_quantity: data.quantity
        });

      if (insertError) {
        console.error('Inventory creation error:', insertError);
        throw insertError;
      }
    }

    console.log('Add inventory process completed successfully');
  } catch (error) {
    console.error('Add inventory process failed:', error);
    throw error;
  }
}

export async function getTransactionHistory() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      inventory:inventory_id (
        uniform_type
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Transaction history error:', error);
    throw error;
  }

  return data;
}

export async function getAnalytics(
  period: 'weekly' | 'monthly' | 'yearly'
) {
  try {
    // Calculate the start date based on the period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Query transactions within the date range
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        inventory:inventory_id (
          uniform_type
        )
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process data for chart
    const processedData = transactions.reduce((acc: any[], transaction: any) => {
      const uniformType = transaction.inventory.uniform_type;
      const type = transaction.type;

      const existingEntry = acc.find(item => item.uniformType === uniformType);
      if (existingEntry) {
        if (type === 'borrow') {
          existingEntry.borrowed++;
        }
        if (transaction.status === 'returned') {
          existingEntry.returned++;
        }
      } else {
        acc.push({
          uniformType,
          borrowed: type === 'borrow' ? 1 : 0,
          returned: transaction.status === 'returned' ? 1 : 0,
        });
      }

      return acc;
    }, []);

    // Sort data by uniform type name
    return processedData.sort((a: any, b: any) => a.uniformType.localeCompare(b.uniformType));

  } catch (error) {
    console.error('Analytics query error:', error);
    throw error;
  }
}