from flask import Blueprint, request, jsonify
from app.models.employee import Employee
from app.extensions import db

employees_bp = Blueprint("employees", __name__, url_prefix="/employees")

@employees_bp.route("/", methods=["GET"])
def get_employees():
    employees = Employee.query.all()
    return jsonify([e.to_dict() for e in employees])

@employees_bp.route("/", methods=["POST"])
def create_employee():
    data = request.json
    employee = Employee(
        name=data["name"],
        phone_number=data["phone_number"],
        gender=data["gender"]
    )
    db.session.add(employee)
    db.session.commit()
    return jsonify(employee.to_dict()), 201

@employees_bp.route("/<int:id>", methods=["PUT"])
def update_employee(id):
    employee = Employee.query.get_or_404(id)
    data = request.json
    employee.name = data.get("name", employee.name)
    employee.phone_number = data.get("phone_number", employee.phone_number)
    employee.gender = data.get("gender", employee.gender)
    db.session.commit()
    return jsonify(employee.to_dict())

@employees_bp.route("/<int:id>", methods=["DELETE"])
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted"})
