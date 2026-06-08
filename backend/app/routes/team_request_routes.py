from flask import Blueprint
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.team import Team
from app.models.user import User
from app.models.team_member import TeamMember
from app.models.team_join_request import TeamJoinRequest

request_bp = Blueprint(
    "team_requests",
    __name__,
    url_prefix="/api/team-requests"
)


# ==========================================
# SEND JOIN REQUEST
# ==========================================

@request_bp.route("/send/<team_id>", methods=["POST"])
@jwt_required()
def send_join_request(team_id):

    user_id = get_jwt_identity()

    team = Team.query.get(team_id)

    if not team:
        return jsonify({
            "message": "Team not found"
        }), 404

    existing_member = TeamMember.query.filter_by(
        team_id=team_id,
        user_id=user_id
    ).first()

    if existing_member:
        return jsonify({
            "message": "You are already a member of this team"
        }), 400

    existing_request = TeamJoinRequest.query.filter_by(
        team_id=team_id,
        user_id=user_id,
        status="pending"
    ).first()

    if existing_request:
        return jsonify({
            "message": "Join request already sent"
        }), 400

    join_request = TeamJoinRequest(
        team_id=team_id,
        user_id=user_id
    )

    db.session.add(join_request)
    db.session.commit()

    return jsonify({
        "message": "Join request sent successfully"
    }), 201


# ==========================================
# GET TEAM REQUESTS
# ==========================================

@request_bp.route("/team/<team_id>", methods=["GET"])
@jwt_required()
def get_team_requests(team_id):

    requests = TeamJoinRequest.query.filter_by(
        team_id=team_id,
        status="pending"
    ).all()

    result = []

    for req in requests:

        user = User.query.get(req.user_id)

        result.append({
            "id": req.id,
            "user_id": req.user_id,
            "name": user.name if user else "Unknown User",
            "email": user.email if user else "",
            "status": req.status,
            "created_at": req.created_at
        })

    return jsonify(result), 200


# ==========================================
# APPROVE REQUEST
# ==========================================

@request_bp.route("/approve/<request_id>", methods=["PUT"])
@jwt_required()
def approve_request(request_id):

    join_request = TeamJoinRequest.query.get(
        request_id
    )

    if not join_request:
        return jsonify({
            "message": "Request not found"
        }), 404

    existing_member = TeamMember.query.filter_by(
        team_id=join_request.team_id,
        user_id=join_request.user_id
    ).first()

    if not existing_member:

        member = TeamMember(
            team_id=join_request.team_id,
            user_id=join_request.user_id,
            role="member"
        )

        db.session.add(member)

    join_request.status = "approved"

    db.session.commit()

    return jsonify({
        "message": "Request approved successfully"
    }), 200


# ==========================================
# REJECT REQUEST
# ==========================================

@request_bp.route("/reject/<request_id>", methods=["PUT"])
@jwt_required()
def reject_request(request_id):

    join_request = TeamJoinRequest.query.get(
        request_id
    )

    if not join_request:
        return jsonify({
            "message": "Request not found"
        }), 404

    join_request.status = "rejected"

    db.session.commit()

    return jsonify({
        "message": "Request rejected successfully"
    }), 200


# ==========================================
# MY REQUESTS
# ==========================================

@request_bp.route("/my-requests", methods=["GET"])
@jwt_required()
def my_requests():

    user_id = get_jwt_identity()

    requests = TeamJoinRequest.query.filter_by(
        user_id=user_id
    ).all()

    result = []

    for req in requests:

        team = Team.query.get(req.team_id)

        result.append({
            "id": req.id,
            "team_id": req.team_id,
            "team_name": team.team_name if team else "Unknown Team",
            "status": req.status,
            "created_at": req.created_at
        })

    return jsonify(result), 200