from datetime import datetime

class Company:
    @staticmethod
    def from_db(data):
        return {
            'id': data.get('id'),
            'name': data.get('name'),
            'email': data.get('email'),
            'address': data.get('address'),
            'seal_image_url': data.get('seal_image_url'),
            'ref_format': data.get('ref_format', 'QT-{YYYY}-{NUM}'),
            'last_quote_number': data.get('last_quote_number', 0)
        }

class Client:
    @staticmethod
    def from_db(data):
        return {
            'id': data.get('id'),
            'company_id': data.get('company_id'),
            'name': data.get('name'),
            'email': data.get('email'),
            'address': data.get('address')
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