from datetime import datetime

class Company:
    def __init__(self, id, name, email, address, ref_format, last_quote_number, seal_image_url=None, pan_number=None, gst_number=None, phone=None):
        self.id = id
        self.name = name
        self.email = email
        self.address = address
        self.ref_format = ref_format
        self.last_quote_number = last_quote_number
        self.seal_image_url = seal_image_url
        self.pan_number = pan_number
        self.gst_number = gst_number
        self.phone = phone

    @staticmethod
    def from_db(db_company):
        return {
            'id': db_company['id'],
            'name': db_company['name'],
            'email': db_company['email'],
            'address': db_company['address'],
            'ref_format': db_company['ref_format'],
            'last_quote_number': db_company['last_quote_number'],
            'seal_image_url': db_company.get('seal_image_url'),
            'pan_number': db_company.get('pan_number'),
            'gst_number': db_company.get('gst_number'),
            'phone': db_company.get('phone')
        }

class Employee:
    @staticmethod
    def from_db(data):
        return {
            'id': data.get('id'),
            'name': data.get('name'),
            'phone_number': data.get('phone_number'),
            'email': data.get('email'),
            'created_at': data.get('created_at'),
            'updated_at': data.get('updated_at')
        }

class Client:
    @staticmethod
    def from_db(data):
        return {
            'id': data.get('id'),
            'name': data.get('name'),
            'business_name': data.get('business_name'),
            'email': data.get('email'),
            'mobile': data.get('mobile'),
            'address': data.get('address'),
            'created_at': data.get('created_at'),
            'updated_at': data.get('updated_at')
        }

class Quotation:
    @staticmethod
    def from_db(data):
        return {
            'id': data.get('id'),
            'company_id': data.get('company_id'),
            'client_id': data.get('client_id'),
            'employee_id': data.get('employee_id'),
            'created_by': data.get('created_by'),  # Employee name
            'ref_number': data.get('ref_number'),
            'date': data.get('date'),
            'items': data.get('items', []),
            'total': float(data.get('total', 0))
        }

class Item:
    @staticmethod
    def from_db(data):
        return {
            'id': data.get('id'),
            'catalogue_id': data.get('catalogue_id'),
            'description': data.get('description'),
            'pack_size': data.get('pack_size'),
            'cas': data.get('cas'),
            'hsn': data.get('hsn'),
            'price': float(data.get('price', 0)) if data.get('price') is not None else None,
            'brand': data.get('brand'),
            'gst_percentage': float(data.get('gst_percentage', 0)) if data.get('gst_percentage') is not None else None,
            'created_at': data.get('created_at'),
            'updated_at': data.get('updated_at')
        } 