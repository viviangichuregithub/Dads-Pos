# app/models/inventoryaudit.py
from datetime import datetime
from app.extensions import db

class InventoryAudit(db.Model):
    __tablename__ = "inventory_audit"

    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey("inventory.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)  # who made the change
    action = db.Column(db.String(50), nullable=False)  # e.g. 'CREATE', 'UPDATE', 'DELETE'
    field_changed = db.Column(db.String(50), nullable=True)  # e.g. 'quantity', 'price'
    old_value = db.Column(db.Text, nullable=True) 
    new_value = db.Column(db.Text, nullable=True)  
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # relationships
    inventory = db.relationship("Inventory", backref=db.backref("audits", lazy=True))
    user = db.relationship("User", backref=db.backref("inventory_audits", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "inventory_id": self.inventory_id,
            "inventory_name": self.inventory.name if self.inventory else "Unknown",  
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else "System",
            "action": self.action,
            "field_changed": self.field_changed,
            "old_value": self.old_value,
            "new_value": self.new_value,
            "timestamp": self.timestamp.isoformat()
        }
