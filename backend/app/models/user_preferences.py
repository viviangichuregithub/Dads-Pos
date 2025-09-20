from app.extensions import db

class UserPreferences(db.Model):
    __tablename__ = "user_preferences"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    theme = db.Column(db.String(20), default="light")  # light / dark
    notifications = db.Column(db.Boolean, default=True)

    user = db.relationship("User", backref=db.backref("preferences", uselist=False))

    def to_dict(self):
        return {
            "theme": self.theme,
            "notifications": self.notifications
        }
