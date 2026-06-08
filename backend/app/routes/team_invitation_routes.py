from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.team_invitation import TeamInvitation
from app.models.user import User
from app.models.team import Team
from app.models.team_member import TeamMember

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

    if not data:
        return jsonify({
            "message": "No data provided"
        }), 400

    if not data.get("team_id"):
        return jsonify({
            "message": "team_id is required"
        }), 400

    if not data.get("receiver_id"):
        return jsonify({
            "message": "receiver_id is required"
        }), 400

    team = Team.query.get(data["team_id"])

    if not team:
        return jsonify({
            "message": "Team not found"
        }), 404

    receiver = User.query.get(data["receiver_id"])

    if not receiver:
        return jsonify({
            "message": "Receiver user not found"
        }), 404

    existing_invitation = TeamInvitation.query.filter_by(
        team_id=data["team_id"],
        receiver_id=data["receiver_id"],
        status="pending"
    ).first()

    if existing_invitation:
        return jsonify({
            "message": "Invitation already sent"
        }), 400

    invitation = TeamInvitation(
        team_id=data["team_id"],
        sender_id=sender_id,
        receiver_id=data["receiver_id"]
    )

    db.session.add(invitation)
    db.session.commit()

    return jsonify({
        "message": "Invitation sent successfully",
        "invitation_id": invitation.id
    }), 201


@invitation_bp.route("/my-invitations", methods=["GET"])
@jwt_required()
def my_invitations():

    user_id = get_jwt_identity()

    invitations = TeamInvitation.query.filter_by(
        receiver_id=user_id
    ).all()

    result = []

    for invitation in invitations:
        result.append({
            "invitation_id": invitation.id,
            "team_id": invitation.team_id,
            "sender_id": invitation.sender_id,
            "status": invitation.status
        })

    return jsonify(result), 200

@invitation_bp.route("/accept/<invitation_id>", methods=["PUT"])
@jwt_required()
def accept_invitation(invitation_id):

    user_id = get_jwt_identity()

    invitation = TeamInvitation.query.get(invitation_id)
    print("JWT User:", user_id)
    print("Invitation Receiver:", invitation.receiver_id)

    if not invitation:
        return jsonify({
            "message": "Invitation not found"
        }), 404

    if invitation.receiver_id != user_id:
        return jsonify({
            "message": "Unauthorized"
        }), 403

    invitation.status = "accepted"

    member = TeamMember(
        team_id=invitation.team_id,
        user_id=user_id,
        role="member"
    )

    db.session.add(member)
    db.session.commit()

    return jsonify({
        "message": "Invitation accepted successfully"
    }), 200


@invitation_bp.route("/reject/<invitation_id>", methods=["PUT"])
@jwt_required()
def reject_invitation(invitation_id):

    user_id = get_jwt_identity()

    invitation = TeamInvitation.query.get(invitation_id)

    if not invitation:
        return jsonify({
            "message": "Invitation not found"
        }), 404

    if invitation.receiver_id != user_id:
        return jsonify({
            "message": "Unauthorized"
        }), 403

    invitation.status = "rejected"

    db.session.commit()

    return jsonify({
        "message": "Invitation rejected successfully"
    }), 200