from flask import Blueprint, jsonify
from app.models import Sale, Inventory, Expense, db
from datetime import datetime, timedelta
from sqlalchemy import func

admin_dashboard_bp = Blueprint("admin_dashboard", __name__, url_prefix="/api/admin/dashboard")

@admin_dashboard_bp.route("/", methods=["GET"])
def get_dashboard_data():
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())

    # KPIs
    total_sales_today = db.session.query(func.count(Sale.id)).filter(func.date(Sale.created_at) == today).scalar()
    total_revenue = db.session.query(func.sum(Sale.amount)).filter(Sale.created_at >= week_start).scalar() or 0
    total_inventory = db.session.query(func.count(Inventory.id)).scalar()
    total_expenses = db.session.query(func.sum(Expense.amount)).filter(Expense.created_at >= week_start).scalar() or 0

    # Chart Data: sales per day for last 7 days
    last_week = today - timedelta(days=6)
    sales_data = (
        db.session.query(
            func.date(Sale.created_at).label("date"),
            func.sum(Sale.amount).label("total")
        )
        .filter(Sale.created_at >= last_week)
        .group_by(func.date(Sale.created_at))
        .all()
    )

    sales_chart = [{"date": str(row.date), "total": row.total} for row in sales_data]

    # Recent Transactions
    recent_sales = (
        db.session.query(Sale)
        .order_by(Sale.created_at.desc())
        .limit(5)
        .all()
    )
    recent_sales_data = [
        {"id": s.id, "item": s.item_name, "amount": s.amount, "date": s.created_at.isoformat()}
        for s in recent_sales
    ]

    return jsonify({
        "summary": {
            "total_sales_today": total_sales_today,
            "total_revenue": total_revenue,
            "total_inventory": total_inventory,
            "total_expenses": total_expenses,
        },
        "sales_chart": sales_chart,
        "recent_sales": recent_sales_data,
    })
