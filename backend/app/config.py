import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///pos.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Important for Vercel <-> Render cookies
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
