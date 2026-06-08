from app import db
import uuid
from app import db

class User(db.Model):

    __tablename__ = "users"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    profession = db.Column(db.String(100))
    education = db.Column(db.String(100))
    experience_level = db.Column(db.String(50))
    bio = db.Column(db.Text)

    role = db.Column(
        db.String(20),
        default="user"
    )