
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db
from app.models.user import User
import re
import os

auth_bp = Blueprint("auth", __name__)

ADMIN_SECRET = os.environ.get("ADMIN_SECRET", "jasanvivian123")

def is_strong_password(password: str) -> tuple[bool, str]:
    """Check password strength and return message if weak."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Za-z]", password):
        return False, "Password must contain at least one letter"
    if not re.search(r"[0-9]", password):
        return False, "Password must contain at least one number"
    return True, ""

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    phone_number = data.get("phone_number", "").strip()
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    role = data.get("role", "staff")
    admin_secret = data.get("admin_secret", "")

    if not all([name, email, phone_number, password, confirm_password, role]):
        return jsonify({"error": "All fields are required"}), 400


    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    valid, msg = is_strong_password(password)
    if not valid:
        return jsonify({"error": msg}), 400

    if role == "admin" and admin_secret != ADMIN_SECRET:
        return jsonify({"error": "Invalid admin secret password"}), 403

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "This email is already registered"}), 400
    if User.query.filter_by(phone_number=phone_number).first():
        return jsonify({"error": "This phone number is already registered"}), 400

    user = User(name=name, email=email, phone_number=phone_number, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": f"Registered successfully as {role}!",
        "user_id": user.id,
        "role": user.role
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(user)

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200

@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route("/me", methods=["GET"])
def me():
    if not current_user.is_authenticated:
        return jsonify({"user": None}), 200

    return jsonify({
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role
        }
    }), 200
