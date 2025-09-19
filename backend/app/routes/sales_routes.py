from flask import Blueprint, jsonify
from app.models.sales import Sale
from datetime import date

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/today", methods=["GET"])
def get_today_sales():
    today = date.today()
    sales = Sale.query.filter(Sale.date == today).all()
    return jsonify([s.to_dict() for s in sales])
