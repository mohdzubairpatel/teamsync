from app import db
import uuid
from datetime import datetime


class TeamInvitation(db.Model):

    __tablename__ = "team_invitations"

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

    def to_dict(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }