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
        # Update companies table schema
        companies_data = {
            "name": "Test Company",
            "email": "test@example.com",
            "address": "Test Address",
            "gst_number": "TEST123",
            "pan_number": "TEST456",
            "seal_image_url": None,
            "ref_format": "QT-{YYYY}-{NUM}",
            "last_quote_number": 0
        }
        
        # Try to insert a test record to verify schema
        try:
            response = supabase.table('companies').insert(companies_data).execute()
            print("Companies table schema verified!")
            
            # Clean up test data
            if response.data:
                supabase.table('companies').delete().eq('id', response.data[0]['id']).execute()
                
        except Exception as e:
            print(f"Error with companies table: {str(e)}")
            print("Please run the following SQL in your Supabase SQL editor:")
            print("""
            -- Update companies table
            alter table companies 
            add column if not exists gst_number text,
            add column if not exists pan_number text,
            add column if not exists created_at timestamp with time zone default current_timestamp,
            add column if not exists updated_at timestamp with time zone default current_timestamp;
            
            -- Create updated_at trigger
            create or replace function update_updated_at_column()
            returns trigger as $$
            begin
                new.updated_at = current_timestamp;
                return new;
            end;
            $$ language plpgsql;

            drop trigger if exists update_companies_updated_at on companies;
            create trigger update_companies_updated_at
                before update on companies
                for each row
                execute function update_updated_at_column();
            """)
            
        print("Database initialization completed!")
        
    except Exception as e:
        print(f"Error initializing database: {e}")

if __name__ == '__main__':
    init_database() 