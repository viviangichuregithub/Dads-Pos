from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, bcrypt, login_manager


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS so frontend (Next.js at 3000) can talk to backend
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True
    )

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    # Import models so Alembic detects them
    from app.models.user import User
    from app.models.employee import Employee  # 👈 employee model

    # User loader for flask-login
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.employees import employees_bp  # 👈 employees blueprint

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(employees_bp)  # uses /employees from blueprint

    return app
