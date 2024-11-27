import { supabase } from '../supabase';

export type MaintenanceStatus = 'pending' | 'in-progress' | 'completed';
export type MaintenancePriority = 'low' | 'normal' | 'high';

export interface MaintenanceRecord {
  id: string;
  inventory_id: string;
  quantity: number;
  condition_status: string;
  notes: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  created_at: string;
  completed_at?: string;
}

export async function getMaintenanceQueue() {
  const { data, error } = await supabase
    .from('maintenance_queue')
    .select(`
      *,
      inventory:inventory_id (
        uniform_type
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateMaintenanceStatus(
  id: string,
  status: MaintenanceStatus,
  notes?: string
) {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  if (notes) {
    updates.processor_notes = notes;
  }

  const { error } = await supabase
    .from('maintenance_queue')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}