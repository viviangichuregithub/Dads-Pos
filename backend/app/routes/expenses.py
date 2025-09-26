# app/routes/expenses.py
from flask import Blueprint, request, jsonify
from datetime import datetime, date
from app.extensions import db
from app.models.expense import Expense
from flask_login import login_required

expenses_bp = Blueprint("expenses", __name__, url_prefix="/expenses")

# ---------------- Add a new expense ----------------
@expenses_bp.route("/", methods=["POST"])
@login_required
def add_expense():
    data = request.get_json()
    description = data.get("description", "")
    amount = data.get("amount")

    if amount is None:
        return jsonify({"error": "Amount is required"}), 400

    expense_date_str = data.get("date")
    if expense_date_str:
        try:
            created_at = datetime.strptime(expense_date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    else:
        created_at = datetime.utcnow()

    expense = Expense(description=description, amount=amount, created_at=created_at)
    db.session.add(expense)
    db.session.commit()

    return jsonify({
        "id": expense.id,
        "description": expense.description,
        "amount": expense.amount,
        "created_at": expense.created_at
    }), 201

@expenses_bp.route("/day", methods=["GET"])
@login_required
def get_expenses_by_day():
    day_str = request.args.get("date")  
    if day_str:
        try:
            day = datetime.strptime(day_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    else:
        day = date.today()

    start = datetime.combine(day, datetime.min.time())
    end = datetime.combine(day, datetime.max.time())

    expenses = Expense.query.filter(Expense.created_at >= start, Expense.created_at <= end).all()
    total_amount = sum(exp.amount for exp in expenses)

    return jsonify({
        "date": day.isoformat(),
        "count": len(expenses),
        "total": total_amount,
        "expenses": [
            {"id": exp.id, "description": exp.description, "amount": exp.amount, "created_at": exp.created_at}
            for exp in expenses
        ]
    })

@expenses_bp.route("/", methods=["GET"])
@login_required
def get_all_expenses():
    expenses = Expense.query.order_by(Expense.created_at.desc()).all()
    return jsonify([
        {"id": exp.id, "description": exp.description, "amount": exp.amount, "created_at": exp.created_at}
        for exp in expenses
    ])

@expenses_bp.route("/<int:expense_id>", methods=["DELETE"])
@login_required
def delete_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted successfully"}), 200


@expenses_bp.route("/summary", methods=["GET"])
@login_required
def get_expenses_summary():
    """
    Query Params:
      - period: 'month' or 'year' (default: 'month')
      - date: YYYY-MM (for month) or YYYY (for year)
    """
    period = request.args.get("period", "month")
    date_str = request.args.get("date")

    if period == "month":
    
        if date_str:
            try:
                year, month = map(int, date_str.split("-"))
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM"}), 400
        else:
            today = datetime.today()
            year, month = today.year, today.month

        start_date = datetime(year, month, 1)
    
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        expenses = Expense.query.filter(
            Expense.created_at >= start_date,
            Expense.created_at < end_date
        ).all()

    elif period == "year":
 
        if date_str:
            try:
                year = int(date_str)
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY"}), 400
        else:
            year = datetime.today().year

        start_date = datetime(year, 1, 1)
        end_date = datetime(year + 1, 1, 1)

        expenses = Expense.query.filter(
            Expense.created_at >= start_date,
            Expense.created_at < end_date
        ).all()
    else:
        return jsonify({"error": "Invalid period. Use 'month' or 'year'."}), 400

    total_amount = sum(exp.amount for exp in expenses)

    return jsonify({
        "period": period,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "total": total_amount,
        "count": len(expenses),
        "expenses": [
            {
                "id": exp.id,
                "description": exp.description,
                "amount": exp.amount,
                "created_at": exp.created_at.isoformat()
            }
            for exp in expenses
        ]
    })
