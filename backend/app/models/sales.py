from datetime import datetime
from app.extensions import db

class Sale(db.Model):
    __tablename__ = "sales"

    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # cash, mpesa, paybill
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "item_name": self.item_name,
            "amount": self.amount,
            "payment_method": self.payment_method,
            "created_at": self.created_at.isoformat()
        }

    def __repr__(self):
        return f"<Sale {self.id} - {self.item_name} - {self.amount}>"
