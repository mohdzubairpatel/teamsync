from flask import Blueprint
from flask import jsonify

from flask_jwt_extended import jwt_required

from app.models.team_member import TeamMember
from app.models.task import Task

analytics_bp = Blueprint(
    "analytics",
    __name__,
    url_prefix="/api/analytics"
)


@analytics_bp.route("/team/<team_id>", methods=["GET"])
@jwt_required()
def team_analytics(team_id):

    total_members = TeamMember.query.filter_by(
        team_id=team_id
    ).count()

    total_tasks = Task.query.filter_by(
        team_id=team_id
    ).count()

    completed_tasks = Task.query.filter_by(
        team_id=team_id,
        status="completed"
    ).count()

    pending_tasks = Task.query.filter_by(
        team_id=team_id,
        status="pending"
    ).count()

    return jsonify({
        "total_members": total_members,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks
    }), 200