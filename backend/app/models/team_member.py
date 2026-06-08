from app import db


class TeamMember(db.Model):

    __tablename__ = "team_members"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    team_id = db.Column(
        db.String(36),
        db.ForeignKey("teams.id"),
        nullable=False
    )

    user_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id"),
        nullable=False
    )

    role = db.Column(
        db.String(50),
        default="member"
    )