from flask import Blueprint, request, jsonify
from app.models.inventory import Inventory
from app.models.inventoryaudit import InventoryAudit
from app.models.sales import Sale, SaleItem
from app.extensions import db
from flask_login import current_user

sales_bp = Blueprint("sales_bp", __name__)

@sales_bp.route("/", methods=["POST"])
def create_sale():
    """
    Record a new sale.
    Expects JSON payload as a list of sale items:
    [
        {"inventory_id": 1, "quantity": 2},
        {"inventory_id": 3, "quantity": 1}
    ]

    Deducts sold quantities from inventory and logs inventory audits.
    """
    data = request.json
    if not data or not isinstance(data, list):
        return jsonify({"error": "Invalid or empty sale data"}), 400

    total = 0
    sale_items = []
    audits = []

    for item in data:
        inventory_id = item.get("inventory_id")
        quantity = item.get("quantity")

        if inventory_id is None or quantity is None:
            return jsonify({"error": "Each item must have 'inventory_id' and 'quantity'"}), 400

        inventory_item = Inventory.query.get(inventory_id)
        if not inventory_item:
            return jsonify({"error": f"Inventory item ID {inventory_id} not found"}), 404

        if inventory_item.quantity < quantity:
            return jsonify({"error": f"Not enough stock for {inventory_item.name}"}), 400

        old_qty = inventory_item.quantity
        inventory_item.quantity -= quantity
        total += inventory_item.price * quantity

        # Add inventory audit
        audits.append(InventoryAudit(
            inventory_id=inventory_item.id,
            action="SALE",
            field_changed="quantity",
            old_value=str(old_qty),
            new_value=str(inventory_item.quantity),
            user_id=current_user.id if current_user else None
        ))

        # Add sale item
        sale_items.append(SaleItem(
            inventory_id=inventory_item.id,
            quantity=quantity,
            price=inventory_item.price
        ))

    # Create sale record
    sale = Sale(total=total, items=sale_items)
    db.session.add(sale)
    db.session.add_all(audits)
    db.session.commit()

    return jsonify({
        "message": "Sale recorded successfully",
        "total": total,
        "items_sold": [{"inventory_id": i.inventory_id, "quantity": i.quantity} for i in sale_items]
    }), 201


@sales_bp.route("/", methods=["GET"])
def list_sales():
    """
    Returns all sales with their items.
    """
    sales = Sale.query.order_by(Sale.created_at.desc()).all()
    results = []
    for s in sales:
        results.append({
            "id": s.id,
            "total": s.total,
            "created_at": s.created_at.isoformat(),
            "items": [{"inventory_id": i.inventory_id, "quantity": i.quantity, "price": i.price} for i in s.items]
        })
    return jsonify(results), 200


@sales_bp.route("/day", methods=["GET"])
def sales_by_day():
    """
    Returns sales for a specific day.
    Query param: ?date=YYYY-MM-DD
    """
    from datetime import datetime, timedelta
    date_str = request.args.get("date")
    if not date_str:
        return jsonify({"error": "Missing 'date' parameter"}), 400

    try:
        day_start = datetime.strptime(date_str, "%Y-%m-%d")
        day_end = day_start + timedelta(days=1)
    except ValueError:
        return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400

    sales = Sale.query.filter(Sale.created_at >= day_start, Sale.created_at < day_end).all()
    results = []
    for s in sales:
        results.append({
            "id": s.id,
            "total": s.total,
            "created_at": s.created_at.isoformat(),
            "items": [{"inventory_id": i.inventory_id, "quantity": i.quantity, "price": i.price} for i in s.items]
        })
    return jsonify(results), 200
