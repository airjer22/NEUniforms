-- First, drop existing tables and types (if they exist)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS inventory;
DROP TYPE IF EXISTS transaction_type;
DROP TYPE IF EXISTS transaction_status;

-- Create enum types
CREATE TYPE transaction_type AS ENUM ('borrow', 'return');
CREATE TYPE transaction_status AS ENUM ('active', 'returned', 'overdue');

-- Create inventory table
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uniform_type VARCHAR NOT NULL,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type transaction_type NOT NULL,
  inventory_id UUID NOT NULL REFERENCES inventory(id),
  borrower_name VARCHAR NOT NULL,
  borrower_email VARCHAR NOT NULL,
  school VARCHAR NOT NULL,
  sport VARCHAR NOT NULL,
  gender VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  expected_return_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_return_date TIMESTAMP WITH TIME ZONE,
  return_condition VARCHAR,
  return_notes TEXT,
  status transaction_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_inventory_uniform_type ON inventory(uniform_type);
CREATE INDEX idx_transactions_inventory_id ON transactions(inventory_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_borrower_email ON transactions(borrower_email);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory
CREATE POLICY "Enable read access for all users" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "Enable write access for authenticated users only" ON inventory
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for transactions
CREATE POLICY "Enable read access for all users" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Enable write access for all users" ON transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON transactions
  FOR UPDATE USING (auth.role() = 'authenticated');