from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
import os
from datetime import datetime
from models.models import Company, Client, Quotation
from docx import Document
from io import BytesIO

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes during development
CORS(app, supports_credentials=True)

# Configure Flask app
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['DEBUG'] = True

# Initialize Supabase client
try:
    supabase = create_client(
        os.getenv('SUPABASE_URL'),
        os.getenv('SUPABASE_KEY')
    )
    # Test the connection
    supabase.table('companies').select('*').limit(1).execute()
    print("Successfully connected to Supabase!")
except Exception as e:
    print(f"Error connecting to Supabase: {e}")
    raise

# Health check route
@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "API is running"})

# Company routes
@app.route('/api/companies', methods=['GET'])
def get_companies():
    try:
        companies = supabase.table('companies').select('*').execute()
        return jsonify({
            "success": True,
            "data": [Company.from_db(company) for company in companies.data]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/companies', methods=['POST'])
def create_company():
    try:
        data = request.json
        company = supabase.table('companies').insert(data).execute()
        return jsonify({
            "success": True,
            "data": Company.from_db(company.data[0])
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Client routes
@app.route('/api/clients', methods=['GET'])
def get_clients():
    try:
        company_id = request.args.get('company_id')
        query = supabase.table('clients').select('*')
        if company_id:
            query = query.eq('company_id', company_id)
        clients = query.execute()
        return jsonify({
            "success": True,
            "data": [Client.from_db(client) for client in clients.data]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/clients', methods=['POST'])
def create_client():
    try:
        data = request.json
        client = supabase.table('clients').insert(data).execute()
        return jsonify({
            "success": True,
            "data": Client.from_db(client.data[0])
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Quotation routes
@app.route('/api/quotations', methods=['GET'])
def get_quotations():
    try:
        # Use Supabase instead of SQLAlchemy
        quotations = supabase.table('quotations').select('*').execute()
        return jsonify({
            'success': True,
            'data': [Quotation.from_db(q) for q in quotations.data]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/quotations', methods=['POST'])
def create_quotation():
    try:
        data = request.json
        print("Received data:", data)  # Debug log
        
        # Fetch company data
        company_response = supabase.table('companies').select('*').eq('id', data['company_id']).execute()
        if not company_response.data:
            return jsonify({"success": False, "error": "Company not found"}), 404
            
        company = Company.from_db(company_response.data[0])
        
        # Generate reference number
        new_number = company['last_quote_number'] + 1
        ref_number = company['ref_format'].format(
            YYYY=datetime.now().year,
            NUM=str(new_number).zfill(4)
        )
        
        # Prepare quotation data
        quotation_data = {
            'company_id': data['company_id'],
            'ref_number': ref_number,
            'date': datetime.utcnow().isoformat(),
            'items': data['items'],
            'total': data['total']
        }
        
        # Create quotation
        quotation_response = supabase.table('quotations').insert(quotation_data).execute()
        
        if not quotation_response.data:
            raise Exception("Failed to create quotation")
            
        # Update company's last quote number
        company_update = supabase.table('companies').update({
            'last_quote_number': new_number
        }).eq('id', data['company_id']).execute()
        
        if not company_update.data:
            print("Warning: Failed to update company's last quote number")
            
        return jsonify({
            "success": True,
            "data": Quotation.from_db(quotation_response.data[0])
        }), 201
            
    except Exception as e:
        print("Error creating quotation:", str(e))  # Debug log
        return jsonify({"success": False, "error": str(e)}), 500

# Document generation route
@app.route('/api/generate-quote/<int:quotation_id>', methods=['GET'])
def generate_quote(quotation_id):
    try:
        # Fetch quotation data
        quotation = supabase.table('quotations').select('*').eq('id', quotation_id).execute()
        if not quotation.data:
            return jsonify({"success": False, "error": "Quotation not found"}), 404
        
        quotation_data = quotation.data[0]
        
        # Fetch company data
        company = supabase.table('companies').select('*').eq('id', quotation_data['company_id']).execute()
        if not company.data:
            return jsonify({"success": False, "error": "Company not found"}), 404
            
        company_data = company.data[0]
        
        # Create a new document
        doc = Document()
        
        # Add letterhead
        doc.add_heading('QUOTATION', 0)
        
        # Add company details
        doc.add_paragraph(f"From: {company_data['name']}")
        if company_data.get('email'):
            doc.add_paragraph(f"Email: {company_data['email']}")
        if company_data.get('address'):
            doc.add_paragraph(f"Address: {company_data['address']}")
            
        # Add quotation details
        doc.add_paragraph(f"Reference Number: {quotation_data['ref_number']}")
        doc.add_paragraph(f"Date: {quotation_data['date'][:10]}")  # Only show date part
        
        # Add items section
        doc.add_heading('Items', level=1)
        items_table = doc.add_table(rows=1, cols=4)
        items_table.style = 'Table Grid'
        header_cells = items_table.rows[0].cells
        header_cells[0].text = 'Item'
        header_cells[1].text = 'Quantity'
        header_cells[2].text = 'Price'
        header_cells[3].text = 'Total'
        
        # Add items
        items = quotation_data.get('items', [])
        for item in items:
            row_cells = items_table.add_row().cells
            row_cells[0].text = str(item.get('name', ''))
            row_cells[1].text = str(item.get('qty', 0))
            price = float(str(item.get('price', 0)).replace('$', '').replace(',', ''))
            row_cells[2].text = f"${price:.2f}"
            total = price * float(item.get('qty', 0))
            row_cells[3].text = f"${total:.2f}"
            
        # Add total
        total = float(str(quotation_data.get('total', 0)).replace('$', '').replace(',', ''))
        doc.add_paragraph(f"\nTotal Amount: ${total:.2f}")
        
        # Save to buffer and return
        buffer = BytesIO()
        doc.save(buffer)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name=f'quote_{quotation_data["ref_number"]}.docx'
        )
        
    except Exception as e:
        print("Error generating quote:", str(e))  # Debug log
        return jsonify({"success": False, "error": str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        "success": False,
        "error": "Resource not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    print("Starting Flask server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True) 