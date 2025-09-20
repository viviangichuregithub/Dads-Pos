# app/routes/settings.py
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.extensions import db
from app.models.user import User
from app.models.inventoryaudit import InventoryAudit   # ✅ added import
from datetime import datetime                          # ✅ for date parsing

settings_bp = Blueprint("settings", __name__)

# -----------------------------
# Profile Management (current user)
# -----------------------------
@settings_bp.route("/profile", methods=["GET", "PUT"])
@login_required
def manage_profile():
    if request.method == "GET":
        return jsonify({
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
        })

    if request.method == "PUT":
        data = request.json
        current_user.name = data.get("name", current_user.name)
        current_user.email = data.get("email", current_user.email)
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200


# -----------------------------
# User Management (Admins only)
# -----------------------------
@settings_bp.route("/users", methods=["GET", "POST"])
@login_required
def manage_users():
    if current_user.role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    if request.method == "GET":
        users = User.query.all()
        return jsonify([
            {"id": u.id, "name": u.name, "email": u.email, "role": u.role}
            for u in users
        ])

    if request.method == "POST":
        data = request.json
        new_user = User(
            name=data["name"],
            email=data["email"],
            role=data.get("role", "staff")
        )
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201


@settings_bp.route("/users/<int:user_id>", methods=["DELETE"])
@login_required
def delete_user(user_id):
    if current_user.role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get_or_404(user_id)
    if user.id == current_user.id:
        return jsonify({"error": "You cannot delete yourself"}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200


# -----------------------------
# Preferences (Theme, notifications, etc.)
# -----------------------------
@settings_bp.route("/preferences", methods=["GET", "PUT"])
@login_required
def preferences():
    prefs = current_user.preferences

    # Create default preferences if none exist
    if not prefs:
        prefs = UserPreferences(user_id=current_user.id)
        db.session.add(prefs)
        db.session.commit()

    if request.method == "GET":
        return jsonify(prefs.to_dict())

    if request.method == "PUT":
        data = request.json
        prefs.theme = data.get("theme", prefs.theme)
        prefs.notifications = data.get("notifications", prefs.notifications)
        db.session.commit()
        return jsonify({
            "message": "Preferences updated",
            "preferences": prefs.to_dict()
        })


# -----------------------------
# Inventory Audit Logs
# -----------------------------
@settings_bp.route("/inventory-audit", methods=["GET"])
@login_required
def get_inventory_audit():
    """
    Get inventory audit logs for a specific date.
    Example: /inventory-audit?date=2025-09-20
    """
    date_str = request.args.get("date")

    if not date_str:
        return jsonify({"error": "Missing 'date' parameter"}), 400

    try:
        # Parse YYYY-MM-DD safely
        query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400

    # Query logs for that date
    logs = (
        InventoryAudit.query
        .filter(db.func.date(InventoryAudit.timestamp) == query_date)
        .order_by(InventoryAudit.timestamp.desc())
        .all()
    )

    # Aggregate counts by action type
    action_summary = {}
    for log in logs:
        action_summary[log.action] = action_summary.get(log.action, 0) + 1

    return jsonify({
        "date": query_date.isoformat(),
        "total": len(logs),
        "by_action": action_summary,  # e.g. {"CREATE": 3, "UPDATE": 5, "DELETE": 2}
        "logs": [log.to_dict() for log in logs]
    }), 200
