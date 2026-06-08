from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db
from app.models.announcement import Announcement

announcement_bp = Blueprint(
    "announcements",
    __name__,
    url_prefix="/api/announcements"
)

@announcement_bp.route("/create", methods=["POST"])
@jwt_required()
def create_announcement():

    user_id = get_jwt_identity()

    data = request.get_json()

    announcement = Announcement(
        team_id=data["team_id"],
        creator_id=user_id,
        title=data["title"],
        message=data["message"]
    )

    db.session.add(announcement)
    db.session.commit()

    return jsonify({
        "message": "Announcement created"
    }), 201

@announcement_bp.route("/team/<team_id>", methods=["GET"])
@jwt_required()
def team_announcements(team_id):

    announcements = Announcement.query.filter_by(
        team_id=team_id
    ).order_by(
        Announcement.created_at.desc()
    ).all()

    result = []

    for announcement in announcements:
        result.append(
            announcement.to_dict()
        )

    return jsonify(result), 200

