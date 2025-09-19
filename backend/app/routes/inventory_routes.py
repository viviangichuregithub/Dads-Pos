# app/routes/inventory_routes.py
from flask import Blueprint, request, jsonify, send_file
from app.models.inventory import Inventory
from app.extensions import db
import pandas as pd
from io import BytesIO

inventory_bp = Blueprint("inventory_bp", __name__)

# --------------------------
# GET /inventory → list all or search with pagination
# --------------------------
@inventory_bp.route("/", methods=["GET"])
def get_inventory():
    search = request.args.get("name")
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))  # default 10 items per page
    except ValueError:
        return jsonify({"error": "Invalid pagination parameters"}), 400

    query = Inventory.query
    if search:
        query = query.filter(Inventory.name.ilike(f"%{search}%"))

    paginated = query.order_by(Inventory.id.desc()).paginate(page=page, per_page=per_page, error_out=False)
    items = [item.to_dict() for item in paginated.items]

    response = {
        "items": items,
        "total": paginated.total,
        "page": paginated.page,
        "per_page": paginated.per_page,
        "pages": paginated.pages
    }

    return jsonify(response), 200

# --------------------------
# POST /inventory → add new shoe
# --------------------------
@inventory_bp.route("/", methods=["POST"])
def add_shoe():
    data = request.json
    if not all(k in data for k in ("name", "price", "quantity")):
        return jsonify({"error": "Missing fields"}), 400

    shoe = Inventory.query.filter_by(name=data["name"]).first()
    if shoe:
        shoe.quantity += int(data["quantity"])
        shoe.price = float(data["price"])
    else:
        shoe = Inventory(
            name=data["name"],
            price=float(data["price"]),
            quantity=int(data["quantity"])
        )
        db.session.add(shoe)

    db.session.commit()
    return jsonify(shoe.to_dict()), 201

# --------------------------
# PATCH /inventory/<id> → update shoe
# --------------------------
@inventory_bp.route("/<int:id>", methods=["PATCH"])
def update_shoe(id):
    shoe = Inventory.query.get_or_404(id)
    data = request.json
    shoe.name = data.get("name", shoe.name)
    shoe.price = float(data.get("price", shoe.price))
    shoe.quantity = int(data.get("quantity", shoe.quantity))
    db.session.commit()
    return jsonify(shoe.to_dict()), 200

# --------------------------
# DELETE /inventory/<id> → delete shoe
# --------------------------
@inventory_bp.route("/<int:id>", methods=["DELETE"])
def delete_shoe(id):
    shoe = Inventory.query.get_or_404(id)
    db.session.delete(shoe)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# --------------------------
# POST /inventory/import/excel → import Excel
# --------------------------
@inventory_bp.route("/import/excel", methods=["POST"])
def import_excel():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    try:
        df = pd.read_excel(file)
        for _, row in df.iterrows():
            name = row.get("name")
            price = row.get("price")
            quantity = row.get("quantity")
            if not all([name, price, quantity]):
                continue
            shoe = Inventory.query.filter_by(name=name).first()
            if shoe:
                shoe.quantity += int(quantity)
                shoe.price = float(price)
            else:
                db.session.add(
                    Inventory(name=name, price=float(price), quantity=int(quantity))
                )
        db.session.commit()
        return jsonify({"message": "Inventory imported successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# --------------------------
# GET /inventory/export/<file_type> → export Excel or PDF
# --------------------------
@inventory_bp.route("/export/<string:file_type>", methods=["GET"])
def export_inventory(file_type):
    items = Inventory.query.all()
    df = pd.DataFrame([item.to_dict() for item in items])
    output = BytesIO()

    if file_type.lower() == "excel":
        df = df[["name", "price", "quantity"]]
        df.to_excel(output, index=False)
        output.seek(0)
        return send_file(output, download_name="inventory.xlsx", as_attachment=True)

    elif file_type.lower() == "pdf":
        # Temporary PDF placeholder using CSV
        df = df[["name", "price", "quantity"]]
        df.to_csv(output, index=False)
        output.seek(0)
        return send_file(output, download_name="inventory.pdf", as_attachment=True)

    else:
        return jsonify({"error": "Invalid file type"}), 400
