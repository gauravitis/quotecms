from datetime import datetime

class BaseModel:
    @staticmethod
    def serialize_datetime(dt):
        return dt.isoformat() if dt else None

    @classmethod
    def from_db(cls, data):
        """Convert database record to model instance"""
        if not data:
            return None
        return data

    def to_dict(self):
        """Convert model to dictionary"""
        return self.__dict__ 