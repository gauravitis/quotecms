from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
import os
from datetime import datetime
from models.models import Company, Employee, Client, Quotation, Item
from docx import Document
from io import BytesIO
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes during development
CORS(app, 
     resources={r"/api/*": {"origins": ["http://localhost:3000"], "supports_credentials": True}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Configure Flask app
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['DEBUG'] = True

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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

@app.route('/api/companies/<int:company_id>', methods=['PUT'])
def update_company(company_id):
    try:
        data = request.json
        company = supabase.table('companies').update(data).eq('id', company_id).execute()
        if not company.data:
            return jsonify({"success": False, "error": "Company not found"}), 404
        return jsonify({
            "success": True,
            "data": Company.from_db(company.data[0])
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/companies/<int:company_id>', methods=['DELETE'])
def delete_company(company_id):
    try:
        # First delete associated quotations
        quotations = supabase.table('quotations').delete().eq('company_id', company_id).execute()
        
        # Then delete associated clients
        clients = supabase.table('clients').delete().eq('company_id', company_id).execute()
        
        # Finally delete the company
        company = supabase.table('companies').delete().eq('id', company_id).execute()
        
        if not company.data:
            return jsonify({"success": False, "error": "Company not found"}), 404
            
        return jsonify({
            "success": True,
            "message": "Company and all associated data deleted successfully"
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/companies/<int:company_id>/seal', methods=['POST'])
def upload_company_seal(company_id):
    try:
        if 'seal_image' not in request.files:
            return jsonify({"success": False, "error": "No file provided"}), 400
            
        file = request.files['seal_image']
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
            
        if file:
            # Secure the filename and create unique name
            filename = secure_filename(file.filename)
            unique_filename = f"{company_id}_{int(datetime.now().timestamp())}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Save the file
            file.save(filepath)
            
            # Update company with seal image URL
            seal_url = f"/uploads/{unique_filename}"  # URL path to access the image
            company = supabase.table('companies').update({
                'seal_image_url': seal_url
            }).eq('id', company_id).execute()
            
            if not company.data:
                return jsonify({"success": False, "error": "Company not found"}), 404
                
            return jsonify({
                "success": True,
                "data": Company.from_db(company.data[0])
            })
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

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

# Employee routes
@app.route('/api/employees', methods=['GET'])
def get_employees():
    try:
        employees = supabase.table('employees').select('*').execute()
        return jsonify({
            "success": True,
            "data": [Employee.from_db(employee) for employee in employees.data]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/employees', methods=['POST'])
def create_employee():
    try:
        data = request.json
        employee = supabase.table('employees').insert(data).execute()
        return jsonify({
            "success": True,
            "data": Employee.from_db(employee.data[0])
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/employees/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    try:
        data = request.json
        employee = supabase.table('employees').update(data).eq('id', employee_id).execute()
        if not employee.data:
            return jsonify({"success": False, "error": "Employee not found"}), 404
        return jsonify({
            "success": True,
            "data": Employee.from_db(employee.data[0])
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    try:
        # Check if employee has any quotations
        quotations = supabase.table('quotations').select('id').eq('employee_id', employee_id).execute()
        if quotations.data:
            return jsonify({
                "success": False,
                "error": "Cannot delete employee with existing quotations"
            }), 400

        employee = supabase.table('employees').delete().eq('id', employee_id).execute()
        if not employee.data:
            return jsonify({"success": False, "error": "Employee not found"}), 404
            
        return jsonify({
            "success": True,
            "message": "Employee deleted successfully"
        })
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

@app.route('/api/hsn/<hsn_code>/gst', methods=['GET'])
def get_gst_percentage(hsn_code):
    try:
        # Comprehensive HSN-GST mapping for chemicals, lab equipment and related products
        gst_mapping = {
            # Chapter 28: Inorganic chemicals
            '28': 18,    # All inorganic chemicals
            '2801': 18,  # Halogens (fluorine, chlorine, bromine and iodine)
            '2802': 18,  # Sulphur, sublimed or precipitated; colloidal sulphur
            '2803': 18,  # Carbon (carbon blacks and other forms of carbon)
            '2804': 18,  # Hydrogen, rare gases and other non-metals
            '2805': 18,  # Alkali or alkaline-earth metals
            '2806': 18,  # Hydrogen chloride and chlorosulphuric acid
            '2807': 18,  # Sulphuric acid and oleum
            '2808': 18,  # Nitric acid; sulphonitric acids
            '2809': 18,  # Phosphorus pentoxide; phosphoric acid
            '2810': 18,  # Oxides of boron; boric acids
            '2811': 18,  # Other inorganic acids
            '2812': 18,  # Halides and halide oxides of non-metals
            '2813': 18,  # Sulphides of non-metals
            '2814': 18,  # Ammonia, anhydrous or in aqueous solution
            '2815': 18,  # Sodium/Potassium hydroxide; peroxides of sodium/potassium
            '2816': 18,  # Hydroxide and peroxide of magnesium
            '2817': 18,  # Zinc oxide; zinc peroxide
            '2818': 18,  # Artificial corundum; aluminum oxide; aluminum hydroxide
            '2819': 18,  # Chromium oxides and hydroxides
            '2820': 18,  # Manganese oxides
            '2821': 18,  # Iron oxides and hydroxides
            '2822': 18,  # Cobalt oxides and hydroxides
            '2823': 18,  # Titanium oxides
            '2824': 18,  # Lead oxides
            '2825': 18,  # Hydrazine, hydroxylamine, inorganic bases
            '2826': 18,  # Fluorides; fluorosilicates, fluoroaluminates
            '2827': 18,  # Chlorides, chloride oxides
            '2828': 18,  # Hypochlorites; commercial calcium hypochlorite
            '2829': 18,  # Chlorates and perchlorates
            '2830': 18,  # Sulphides; polysulphides
            '2831': 18,  # Dithionites and sulphoxylates
            '2832': 18,  # Sulphites; thiosulphates
            '2833': 18,  # Sulphates; alums; peroxosulphates
            '2834': 18,  # Nitrites; nitrates
            '2835': 18,  # Phosphinates, phosphonates, phosphates
            '2836': 18,  # Carbonates; peroxocarbonates
            '2837': 18,  # Cyanides, cyanide oxides
            '2838': 18,  # Fulminates, cyanates and thiocyanates
            '2839': 18,  # Silicates; commercial alkali metal silicates
            '2840': 18,  # Borates; peroxoborates
            '2841': 18,  # Salts of oxometallic/peroxometallic acids
            '2842': 18,  # Other salts of inorganic acids/peroxoacids
            '2843': 18,  # Colloidal precious metals
            '2844': 18,  # Radioactive chemical elements
            '2845': 18,  # Isotopes and their compounds
            '2846': 18,  # Compounds of rare-earth metals
            '2847': 18,  # Hydrogen peroxide
            '2848': 18,  # Phosphides
            '2849': 18,  # Carbides
            '2850': 18,  # Hydrides, nitrides, azides, silicides
            '2851': 18,  # Other inorganic compounds

            # Chapter 29: Organic Chemicals
            '29': 18,    # All organic chemicals
            '2901': 18,  # Acyclic hydrocarbons
            '2902': 18,  # Cyclic hydrocarbons
            '2903': 18,  # Halogenated derivatives of hydrocarbons
            '2904': 18,  # Sulphonated, nitrated derivatives
            '2905': 18,  # Acyclic alcohols and their derivatives
            '2906': 18,  # Cyclic alcohols and their derivatives
            '2907': 18,  # Phenols; phenol-alcohols
            '2908': 18,  # Derivatives of phenols
            '2909': 18,  # Ethers, ether-alcohols, ether-phenols
            '2910': 18,  # Epoxides, epoxyalcohols, epoxyphenols
            '2911': 18,  # Acetals and hemiacetals
            '2912': 18,  # Aldehydes
            '2913': 18,  # Halogenated, sulphonated derivatives of aldehydes
            '2914': 18,  # Ketones and quinones
            '2915': 18,  # Saturated acyclic monocarboxylic acids
            '2916': 18,  # Unsaturated acyclic monocarboxylic acids
            '2917': 18,  # Polycarboxylic acids
            '2918': 18,  # Carboxylic acids with additional oxygen function
            '2919': 18,  # Phosphoric esters and their salts
            '2920': 18,  # Esters of other inorganic acids
            '2921': 18,  # Amine-function compounds
            '2922': 18,  # Oxygen-function amino-compounds
            '2923': 18,  # Quaternary ammonium salts and hydroxides
            '2924': 18,  # Carboxyamide-function compounds
            '2925': 18,  # Carboxyimide-function compounds
            '2926': 18,  # Nitrile-function compounds
            '2927': 18,  # Diazo-, azo- or azoxy-compounds
            '2928': 18,  # Organic derivatives of hydrazine
            '2929': 18,  # Compounds with other nitrogen function
            '2930': 18,  # Organo-sulphur compounds
            '2931': 18,  # Other organo-inorganic compounds
            '2932': 18,  # Heterocyclic compounds with oxygen
            '2933': 18,  # Heterocyclic compounds with nitrogen
            '2934': 18,  # Nucleic acids and their salts
            '2935': 18,  # Sulphonamides
            '2936': 18,  # Provitamins and vitamins
            '2937': 18,  # Hormones
            '2938': 18,  # Glycosides
            '2939': 18,  # Vegetable alkaloids
            '2940': 18,  # Sugars, chemically pure
            '2941': 18,  # Antibiotics
            '2942': 18,  # Other organic compounds

            # Chapter 38: Miscellaneous chemical products
            '38': 18,    # All miscellaneous chemical products
            '3801': 18,  # Artificial graphite; preparations
            '3802': 18,  # Activated carbon; activated natural products
            '3803': 18,  # Tall oil
            '3804': 18,  # Residual lyes from wood pulp
            '3805': 18,  # Gum, wood or sulphate turpentine
            '3806': 18,  # Rosin and resin acids
            '3807': 18,  # Wood tar; wood tar oils
            '3808': 18,  # Insecticides, fungicides
            '3809': 18,  # Finishing agents, dye carriers
            '3810': 18,  # Pickling preparations for metal surfaces
            '3811': 18,  # Anti-knock preparations
            '3812': 18,  # Prepared rubber accelerators
            '3813': 18,  # Preparations for fire-extinguishers
            '3814': 18,  # Organic composite solvents
            '3815': 18,  # Reaction initiators, accelerators
            '3816': 18,  # Refractory cements, mortars
            '3817': 18,  # Mixed alkylbenzenes
            '3818': 18,  # Chemical elements for electronics
            '3819': 18,  # Hydraulic brake fluids
            '3820': 18,  # Anti-freezing preparations
            '3821': 18,  # Prepared culture media
            '3822': 18,  # Diagnostic or laboratory reagents
            '3823': 18,  # Industrial monocarboxylic fatty acids
            '3824': 18,  # Prepared binders; chemical products
            '3825': 18,  # Residual products of chemical industry
            '3826': 18,  # Biodiesel and mixtures

            # Chapter 70: Glass and glassware (Laboratory glassware)
            '7017': 18,  # Laboratory, hygienic or pharmaceutical glassware
            '701710': 18,  # Of fused quartz or other fused silica
            '701720': 18,  # Of other glass having linear coefficient
            '701790': 18,  # Other laboratory glassware

            # Chapter 90: Scientific and laboratory instruments
            '9011': 18,  # Microscopes
            '9012': 18,  # Microscopes other than optical
            '9015': 18,  # Surveying instruments
            '9016': 18,  # Balances of a sensitivity
            '9017': 18,  # Drawing, marking-out instruments
            '9018': 12,  # Medical instruments and appliances
            '9019': 12,  # Mechano-therapy appliances
            '9022': 18,  # X-ray apparatus
            '9023': 18,  # Instruments, apparatus and models
            '9024': 18,  # Machines for testing materials
            '9025': 18,  # Hydrometers, thermometers
            '9026': 18,  # Instruments for measuring flow
            '9027': 18,  # Instruments for physical/chemical analysis
            '9028': 18,  # Gas, liquid or electricity meters
            '9029': 18,  # Revolution counters, taximeters
            '9030': 18,  # Oscilloscopes, spectrum analyzers
            '9031': 18,  # Measuring or checking instruments
            '9032': 18,  # Automatic regulating instruments
            '9033': 18,  # Parts and accessories for machines
        }
        
        # Try to match HSN code at different levels (8, 6, 4, 2 digits)
        hsn_variants = [
            hsn_code,  # Full 8-digit code
            hsn_code[:6] if len(hsn_code) >= 6 else None,  # First 6 digits
            hsn_code[:4] if len(hsn_code) >= 4 else None,  # First 4 digits
            hsn_code[:2] if len(hsn_code) >= 2 else None   # First 2 digits
        ]
        
        # Try each variant, from most specific to least specific
        for variant in hsn_variants:
            if variant and variant in gst_mapping:
                return jsonify({
                    'success': True,
                    'gst_percentage': gst_mapping[variant]
                })
        
        # If no match found
        return jsonify({
            'success': False,
            'error': 'GST percentage not found for this HSN code'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Item routes
@app.route('/api/items', methods=['GET'])
def get_items():
    try:
        items = supabase.table('items').select('*').execute()
        return jsonify({
            "success": True,
            "data": [Item.from_db(item) for item in items.data]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/items', methods=['POST'])
def create_item():
    try:
        data = request.json
        item = supabase.table('items').insert(data).execute()
        return jsonify({
            "success": True,
            "data": Item.from_db(item.data[0])
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    try:
        data = request.json
        item = supabase.table('items').update(data).eq('id', item_id).execute()
        if not item.data:
            return jsonify({"success": False, "error": "Item not found"}), 404
        return jsonify({
            "success": True,
            "data": Item.from_db(item.data[0])
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    try:
        # Check if item is used in any quotations before deleting
        # You might want to add this check when quotations are implemented
        item = supabase.table('items').delete().eq('id', item_id).execute()
        if not item.data:
            return jsonify({"success": False, "error": "Item not found"}), 404
            
        return jsonify({
            "success": True,
            "message": "Item deleted successfully"
        })
    except Exception as e:
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