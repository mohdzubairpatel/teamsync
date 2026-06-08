from app import db
import uuid
from datetime import datetime


class Task(db.Model):

    __tablename__ = "tasks"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    team_id = db.Column(
        db.String(36),
        db.ForeignKey("teams.id"),
        nullable=False
    )

    assigned_to = db.Column(
        db.String(36),
        db.ForeignKey("users.id"),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        default="pending"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "team_id": self.team_id,
            "assigned_to": self.assigned_to,
            "status": self.status,
            "created_at": self.created_at
        }