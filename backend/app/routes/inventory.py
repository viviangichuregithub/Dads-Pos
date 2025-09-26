# routes/inventory.py
from flask import Blueprint, request, jsonify, send_file
from app import db
from models import Shoe
import pandas as pd
from io import BytesIO

inventory_bp = Blueprint('inventory', __name__, url_prefix='/inventory')

@inventory_bp.route('/', methods=['GET'])
def get_inventory():
    search = request.args.get('name', '')
    query = Shoe.query
    if search:
        query = query.filter(Shoe.name.ilike(f'%{search}%'))
    shoes = query.all()
    return jsonify([{'id': s.id, 'name': s.name, 'price': s.price, 'quantity': s.quantity} for s in shoes])

@inventory_bp.route('/', methods=['POST'])
def add_shoe():
    data = request.json
    if not all(k in data for k in ('name', 'price', 'quantity')):
        return jsonify({'error': 'Missing fields'}), 400

    shoe = Shoe.query.filter_by(name=data['name']).first()
    if shoe:
        shoe.quantity += data['quantity']
        shoe.price = data['price'] 
    else:
        shoe = Shoe(name=data['name'], price=data['price'], quantity=data['quantity'])
        db.session.add(shoe)

    db.session.commit()
    return jsonify({'message': 'Shoe added/updated successfully'})

@inventory_bp.route('/<int:id>', methods=['PATCH'])
def update_shoe(id):
    shoe = Shoe.query.get_or_404(id)
    data = request.json
    shoe.name = data.get('name', shoe.name)
    shoe.price = data.get('price', shoe.price)
    shoe.quantity = data.get('quantity', shoe.quantity)
    db.session.commit()
    return jsonify({'message': 'Shoe updated successfully'})

@inventory_bp.route('/<int:id>', methods=['DELETE'])
def delete_shoe(id):
    shoe = Shoe.query.get_or_404(id)
    db.session.delete(shoe)
    db.session.commit()
    return jsonify({'message': 'Shoe deleted successfully'})

@inventory_bp.route('/import/excel', methods=['POST'])
def import_excel():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    df = pd.read_excel(file)

    for _, row in df.iterrows():
        shoe = Shoe.query.filter_by(name=row['name']).first()
        if shoe:
            shoe.quantity += row['quantity']
            shoe.price = row['price']
        else:
            db.session.add(Shoe(name=row['name'], price=row['price'], quantity=row['quantity']))
    db.session.commit()
    return jsonify({'message': 'Inventory imported successfully'})

@inventory_bp.route('/export/<string:file_type>', methods=['GET'])
def export_inventory(file_type):
    shoes = Shoe.query.all()
    df = pd.DataFrame([{'name': s.name, 'price': s.price, 'quantity': s.quantity} for s in shoes])

    if file_type == 'excel':
        output = BytesIO()
        df.to_excel(output, index=False)
        output.seek(0)
        return send_file(output, download_name='inventory.xlsx', as_attachment=True)
    elif file_type == 'pdf':
        import pdfkit
        html = df.to_html(index=False)
        pdf = pdfkit.from_string(html, False)
        return send_file(BytesIO(pdf), download_name='inventory.pdf', as_attachment=True)
    else:
        return jsonify({'error': 'Invalid file type'}), 400
