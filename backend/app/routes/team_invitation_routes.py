from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.user import User
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.team_invitation import TeamInvitation


invitation_bp = Blueprint(
    "invitations",
    __name__,
    url_prefix="/api/invitations"
)


@invitation_bp.route("/send", methods=["POST"])
@jwt_required()
def send_invitation():

    sender_id = get_jwt_identity()

    data = request.get_json()

    receiver_id = data.get("receiver_id")
    team_id = data.get("team_id")

    if not receiver_id:
        return jsonify({
            "message": "receiver_id is required"
        }), 400

    invitation = TeamInvitation(
        team_id=team_id,
        sender_id=sender_id,
        receiver_id=receiver_id
    )

    db.session.add(invitation)
    db.session.commit()

    return jsonify({
        "message": "Invitation sent"
    }), 201

@invitation_bp.route("/my", methods=["GET"])
@jwt_required()
def my_invitations():

    user_id = get_jwt_identity()

    invitations = TeamInvitation.query.filter_by(
        receiver_id=user_id,
        status="pending"
    ).all()

    result = []

    for invitation in invitations:

        team = Team.query.get(
            invitation.team_id
        )

        result.append({
            "id": invitation.id,
            "team_id": invitation.team_id,
            "team_name": team.team_name,
            "status": invitation.status
        })

    return jsonify(result), 200


@invitation_bp.route(
    "/accept/<invitation_id>",
    methods=["POST"]
)
@jwt_required()
def accept_invitation(invitation_id):

    invitation = TeamInvitation.query.get(
        invitation_id
    )

    if not invitation:
        return jsonify({
            "message": "Invitation not found"
        }), 404

    invitation.status = "accepted"

    member = TeamMember(
        team_id=invitation.team_id,
        user_id=invitation.receiver_id,
        role="member"
    )

    db.session.add(member)
    db.session.commit()

    return jsonify({
        "message": "Invitation accepted"
    }), 200


@invitation_bp.route(
    "/reject/<invitation_id>",
    methods=["POST"]
)
@jwt_required()
def reject_invitation(invitation_id):

    invitation = TeamInvitation.query.get(
        invitation_id
    )

    if not invitation:
        return jsonify({
            "message": "Invitation not found"
        }), 404

    invitation.status = "rejected"

    db.session.commit()

    return jsonify({
        "message": "Invitation rejected"
    }), 200