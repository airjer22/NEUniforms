export interface Transaction {
  id: string;
  type: 'borrow' | 'return';
  borrower_name: string;
  borrower_email: string;
  school: string;
  sport: string;
  gender: string;
  quantity: number;
  created_at: string;
  expected_return_date: string;
  actual_return_date: string | null;
  return_condition: string | null;
  return_notes: string | null;
  status: 'active' | 'returned' | 'overdue';
  inventory: {
    uniform_type: string;
  };
}