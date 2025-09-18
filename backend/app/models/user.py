from datetime import datetime
from app.extensions import db, bcrypt
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = "users"

    # ---------------- Columns ----------------
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    # Role field: admin or staff
    role = db.Column(db.String(20), nullable=False, default="staff")

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # ---------------- Password methods ----------------
    def set_password(self, password: str):
        """Hash and store a password."""
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password: str) -> bool:
        """Check if provided password matches the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, password)

    # ---------------- String representation ----------------
    def __repr__(self):
        return f"<User id={self.id}, email={self.email}, role={self.role}>"

    # ---------------- Optional Flask-Login overrides ----------------
    # UserMixin already provides:
    #   - is_authenticated
    #   - is_active
    #   - is_anonymous
    #   - get_id()
    # You can override them if you want custom behavior
