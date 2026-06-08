from app import db
import uuid
from datetime import datetime


class ConnectionRequest(db.Model):

    __tablename__ = "connection_requests"

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

    status = db.Column(
        db.String(20),
        default="pending"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )