from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, bcrypt, login_manager


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True,
    )

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    # Import models (make sure all are registered here)
    from app.models.user import User
    from app.models.employee import Employee
    from app.models.inventory import Inventory
    from app.models.sales import Sale
    from app.models.expense import Expense
    from app.models.inventoryaudit import InventoryAudit
    from app.models.user_preferences import UserPreferences

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.employees import employees_bp
    from app.routes.inventory_routes import inventory_bp
    from app.routes.sales_routes import sales_bp
    from app.routes.admin_dashboard import admin_dashboard_bp
    from app.routes.settings import settings_bp  

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(employees_bp, url_prefix="/employees")
    app.register_blueprint(inventory_bp, url_prefix="/inventory")
    app.register_blueprint(sales_bp, url_prefix="/sales")
    app.register_blueprint(admin_dashboard_bp, url_prefix="/api/admin/dashboard")
    app.register_blueprint(settings_bp, url_prefix="/settings") 

    return app
