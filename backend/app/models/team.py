from app import db
import uuid


class Team(db.Model):

    __tablename__ = "teams"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    team_name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    leader_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id"),
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="active"
    )