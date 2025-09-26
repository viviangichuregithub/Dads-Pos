# app/routes/settings.py
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.extensions import db
from app.models.user import User
from app.models.inventoryaudit import InventoryAudit
from datetime import datetime, timezone, timedelta
import pytz

settings_bp = Blueprint("settings", __name__)

@settings_bp.route("/profile", methods=["GET", "PUT"])
@login_required
def manage_profile():
    if request.method == "GET":
        return jsonify({
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "phone_number": current_user.phone_number,
            "role": current_user.role,
            "avatar": current_user.avatar,
            "gender": current_user.gender
        })

    if request.method == "PUT":
        data = request.json
        current_user.name = data.get("name", current_user.name)
        current_user.email = data.get("email", current_user.email)
        current_user.avatar = data.get("avatar", current_user.avatar)
        current_user.gender = data.get("gender", current_user.gender)
        current_user.phone_number = data.get("phone_number", current_user.phone_number)
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200


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


@settings_bp.route("/inventory-audit", methods=["GET"])
@login_required
def get_inventory_audit():
    date_str = request.args.get("date")

    if not date_str:
        return jsonify({"error": "Missing 'date' parameter"}), 400

    try:

        local_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400

    kenya_tz = pytz.timezone("Africa/Nairobi")
    
    start_utc = kenya_tz.localize(datetime.combine(local_date, datetime.min.time())).astimezone(pytz.UTC)
    end_utc = kenya_tz.localize(datetime.combine(local_date, datetime.max.time())).astimezone(pytz.UTC)

    logs = (
        InventoryAudit.query
        .filter(InventoryAudit.timestamp >= start_utc)
        .filter(InventoryAudit.timestamp <= end_utc)
        .order_by(InventoryAudit.timestamp.desc())
        .all()
    )

    action_summary = {}
    for log in logs:
        action_summary[log.action] = action_summary.get(log.action, 0) + 1

    return jsonify({
        "date": local_date.isoformat(),
        "total": len(logs),
        "by_action": action_summary,
        "logs": [log.to_dict() for log in logs]
    }), 200