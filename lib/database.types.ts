export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      inventory: {
        Row: {
          id: string
          uniform_type: string
          total_quantity: number
          available_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          uniform_type: string
          total_quantity: number
          available_quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          uniform_type?: string
          total_quantity?: number
          available_quantity?: number
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          type: 'borrow' | 'return'
          inventory_id: string
          borrower_name: string
          borrower_email: string
          school: string
          quantity: number
          expected_return_date: string
          actual_return_date: string | null
          return_condition: string | null
          return_notes: string | null
          status: 'active' | 'returned' | 'overdue'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'borrow' | 'return'
          inventory_id: string
          borrower_name: string
          borrower_email: string
          school: string
          quantity: number
          expected_return_date: string
          actual_return_date?: string | null
          return_condition?: string | null
          return_notes?: string | null
          status?: 'active' | 'returned' | 'overdue'
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: 'borrow' | 'return'
          inventory_id?: string
          borrower_name?: string
          borrower_email?: string
          school?: string
          quantity?: number
          expected_return_date?: string
          actual_return_date?: string | null
          return_condition?: string | null
          return_notes?: string | null
          status?: 'active' | 'returned' | 'overdue'
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}