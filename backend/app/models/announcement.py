from app import db
import uuid
from datetime import datetime


class Announcement(db.Model):

    __tablename__ = "announcements"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    team_id = db.Column(
        db.String(36),
        db.ForeignKey("teams.id"),
        nullable=False
    )

    creator_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id"),
        nullable=False
    )

    title = db.Column(
        db.String(255),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "creator_id": self.creator_id,
            "title": self.title,
            "message": self.message,
            "created_at": self.created_at
        }