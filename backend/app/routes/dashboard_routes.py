from flask import Blueprint, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.models.team_member import TeamMember
from app.models.task import Task

dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)

@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def dashboard():

    user_id = get_jwt_identity()

    user_teams = TeamMember.query.filter_by(
        user_id=user_id
    ).all()

    team_ids = [
        team.team_id
        for team in user_teams
    ]

    total_teams = len(team_ids)

    total_tasks = Task.query.filter(
        Task.team_id.in_(team_ids)
    ).count() if team_ids else 0

    completed_tasks = Task.query.filter(
        Task.team_id.in_(team_ids),
        Task.status == "completed"
    ).count() if team_ids else 0

    pending_tasks = Task.query.filter(
        Task.team_id.in_(team_ids),
        Task.status == "pending"
    ).count() if team_ids else 0

    return jsonify({
        "total_teams": total_teams,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks
    }), 200