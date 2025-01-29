-- First, remove the company_id foreign key constraint if it exists
ALTER TABLE IF EXISTS clients
DROP CONSTRAINT IF EXISTS clients_company_id_fkey;

-- Remove the company_id column
ALTER TABLE clients
DROP COLUMN IF EXISTS company_id;

-- Add the business_name column
ALTER TABLE clients
ADD COLUMN business_name text NOT NULL DEFAULT '';

-- Remove the default after adding the column
ALTER TABLE clients
ALTER COLUMN business_name DROP DEFAULT; 