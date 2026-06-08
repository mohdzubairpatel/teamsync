from app import db
import uuid
from datetime import datetime


class Message(db.Model):

    __tablename__ = "messages"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    sender_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id"),
        nullable=False
    )

    receiver_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id"),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    is_read = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )