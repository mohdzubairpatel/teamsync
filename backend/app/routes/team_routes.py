from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.team import Team
from app.models.team_member import TeamMember

team_bp = Blueprint(
    "teams",
    __name__,
    url_prefix="/api/teams"
)


@team_bp.route("/create", methods=["POST"])
@jwt_required()
def create_team():

    leader_id = get_jwt_identity()

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data provided"
        }), 400

    if not data.get("team_name"):
        return jsonify({
            "message": "team_name is required"
        }), 400

    team = Team(
        team_name=data["team_name"],
        description=data.get("description"),
        leader_id=leader_id
    )

    db.session.add(team)
    db.session.commit()

    leader_member = TeamMember(
        team_id=team.id,
        user_id=leader_id,
        role="leader"
    )

    db.session.add(leader_member)
    db.session.commit()

    return jsonify({
        "message": "Team created successfully",
        "team_id": team.id
    }), 201


@team_bp.route("/my-teams", methods=["GET"])
@jwt_required()
def my_teams():

    user_id = get_jwt_identity()

    memberships = TeamMember.query.filter_by(
        user_id=user_id
    ).all()

    result = []

    for membership in memberships:

        team = Team.query.get(
            membership.team_id
        )

        if team:
            result.append({
                "id": team.id,
                "team_name": team.team_name,
                "description": team.description,
                "leader_id": team.leader_id,
                "status": team.status,
                "role": membership.role
            })

    return jsonify(result), 200


@team_bp.route("/<team_id>", methods=["GET"])
@jwt_required()
def team_details(team_id):

    team = Team.query.get(team_id)

    if not team:
        return jsonify({
            "message": "Team not found"
        }), 404

    members = TeamMember.query.filter_by(
        team_id=team_id
    ).all()

    member_list = []

    for member in members:
        member_list.append({
            "user_id": member.user_id,
            "role": member.role
        })

    return jsonify({
        "id": team.id,
        "team_name": team.team_name,
        "description": team.description,
        "leader_id": team.leader_id,
        "status": team.status,
        "members": member_list
    }), 200


@team_bp.route("/<team_id>/members", methods=["GET"])
@jwt_required()
def team_members(team_id):

    members = TeamMember.query.filter_by(
        team_id=team_id
    ).all()

    result = []

    for member in members:
        result.append({
            "user_id": member.user_id,
            "role": member.role
        })

    return jsonify(result), 200

@team_bp.route("/all", methods=["GET"])
@jwt_required()
def all_teams():

    teams = Team.query.all()

    result = []

    for team in teams:

        result.append({
            "id": team.id,
            "team_name": team.team_name,
            "description": team.description,
            "status": team.status
        })

    return jsonify(result), 200