from datetime import datetime

class Company:
    @staticmethod
    def from_db(data):
        return {
            'id': data.get('id'),
            'name': data.get('name'),
            'email': data.get('email'),
            'address': data.get('address'),
            'gst_number': data.get('gst_number'),
            'pan_number': data.get('pan_number'),
            'seal_image_url': data.get('seal_image_url'),
            'ref_format': data.get('ref_format', 'QT-{YYYY}-{NUM}'),
            'last_quote_number': data.get('last_quote_number', 0),
            'bank_name': data.get('bank_name'),
            'account_number': data.get('account_number'),
            'ifsc_code': data.get('ifsc_code'),
            'account_type': data.get('account_type', 'Current Account'),
            'created_at': data.get('created_at'),
            'updated_at': data.get('updated_at')
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