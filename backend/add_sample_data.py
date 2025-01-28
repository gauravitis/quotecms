from app import supabase

def add_sample_data():
    try:
        # Add a sample company
        company = supabase.table('companies').insert({
            'name': 'Tech Solutions Inc.',
            'email': 'contact@techsolutions.com',
            'address': '123 Tech Street, Silicon Valley',
            'seal_image_url': 'https://placehold.co/200x200?text=TechSolutions',
            'ref_format': 'TS-{YYYY}-{NUM}',
            'last_quote_number': 0
        }).execute()
        
        print('Company created:', company.data)
        
        # Add a sample client
        client = supabase.table('clients').insert({
            'company_id': company.data[0]['id'],
            'name': 'John Smith Enterprises',
            'email': 'john@smithenterprises.com',
            'address': '456 Business Ave, New York'
        }).execute()
        
        print('Client created:', client.data)
        
        print('Sample data added successfully!')
        
    except Exception as e:
        print(f"Error adding sample data: {e}")

if __name__ == '__main__':
    add_sample_data() 