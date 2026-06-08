from app import db
import uuid


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
        db.String(30),
        default="pending"
    )