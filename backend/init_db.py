from supabase import create_client
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

def init_database():
    try:
        # Create all tables in a single SQL statement
        create_tables = """
        -- Create companies table
        create table if not exists companies (
            id bigint primary key generated always as identity,
            name text not null,
            email text,
            address text,
            seal_image_url text,
            ref_format text default 'QT-{YYYY}-{NUM}',
            last_quote_number int default 0
        );

        -- Create clients table
        create table if not exists clients (
            id bigint primary key generated always as identity,
            company_id bigint references companies(id),
            name text not null,
            email text,
            address text
        );

        -- Create quotations table
        create table if not exists quotations (
            id bigint primary key generated always as identity,
            company_id bigint references companies(id),
            client_id bigint references clients(id),
            ref_number text not null,
            date timestamp default current_timestamp,
            items jsonb,
            total numeric(10,2)
        );

        -- Create RPC function for atomic quote number updates
        create or replace function increment_quote_number(company_id bigint, current_number int)
        returns void as $$
        begin
            update companies
            set last_quote_number = current_number + 1
            where id = company_id
            and last_quote_number = current_number;
        end;
        $$ language plpgsql;
        """
        
        # Execute the SQL using the REST API
        response = supabase.rest.sql().execute(create_tables)
        print("Database tables and functions created successfully!")
        print(response)

    except Exception as e:
        print(f"Error initializing database: {e}")

if __name__ == '__main__':
    init_database() 