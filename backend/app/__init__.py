from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, bcrypt, login_manager


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:3000",
        "https://shoe-world-base.onrender.com",
        "https://pos-app-orcin-chi.vercel.app"
    ]}},
    supports_credentials=True,
)


    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"


    from app.models.user import User
    from app.models.employee import Employee
    from app.models.inventory import Inventory
    from app.models.sales import Sale
    from app.models.expense import Expense
    from app.models.inventoryaudit import InventoryAudit
    from app.models.expense import Expense


    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from app.routes.auth import auth_bp
    from app.routes.employees import employees_bp
    from app.routes.inventory_routes import inventory_bp
    from app.routes.sales_routes import sales_bp
    from app.routes.admin_dashboard import admin_dashboard_bp
    from app.routes.settings import settings_bp
    from app.routes.expenses import expenses_bp  

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(employees_bp, url_prefix="/employees")
    app.register_blueprint(inventory_bp, url_prefix="/inventory")
    app.register_blueprint(sales_bp, url_prefix="/sales")
    app.register_blueprint(admin_dashboard_bp, url_prefix="/api/admin/dashboard")
    app.register_blueprint(settings_bp, url_prefix="/settings") 
    app.register_blueprint(expenses_bp, url_prefix="/expenses")

    return app
