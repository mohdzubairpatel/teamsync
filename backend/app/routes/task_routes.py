from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

from app import db
from app.models.task import Task

task_bp = Blueprint(
    "tasks",
    __name__,
    url_prefix="/api/tasks"
)


@task_bp.route("/test", methods=["GET"])
def test():
    return jsonify({
        "message": "Task routes working"
    }), 200


@task_bp.route("/create", methods=["POST"])
@jwt_required()
def create_task():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data provided"
        }), 400

    if not data.get("title"):
        return jsonify({
            "message": "title is required"
        }), 400

    if not data.get("team_id"):
        return jsonify({
            "message": "team_id is required"
        }), 400

    user_id = get_jwt_identity()

    task = Task(
        title=data["title"],
        description=data.get("description"),
        team_id=data["team_id"],
        assigned_to=user_id
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({
        "message": "Task created successfully",
        "task_id": task.id
    }), 201


@task_bp.route("/team/<team_id>", methods=["GET"])
@jwt_required()
def get_team_tasks(team_id):

    tasks = Task.query.filter_by(
        team_id=team_id
    ).all()

    return jsonify([
        task.to_dict()
        for task in tasks
    ]), 200

@task_bp.route("/assign/<task_id>", methods=["PUT"])
@jwt_required()
def assign_task(task_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data provided"
        }), 400

    if not data.get("user_id"):
        return jsonify({
            "message": "user_id is required"
        }), 400

    task = Task.query.get(task_id)

    if not task:
        return jsonify({
            "message": "Task not found"
        }), 404

    task.assigned_to = data["user_id"]

    db.session.commit()

    return jsonify({
        "message": "Task assigned successfully"
    }), 200

@task_bp.route("/status/<task_id>", methods=["PUT"])
@jwt_required()
def update_task_status(task_id):

    data = request.get_json()

    if not data.get("status"):
        return jsonify({
            "message": "status is required"
        }), 400

    task = Task.query.get(task_id)

    if not task:
        return jsonify({
            "message": "Task not found"
        }), 404

    task.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Task status updated"
    }), 200

@task_bp.route("/all", methods=["GET"])
def all_tasks():

    tasks = Task.query.all()

    return jsonify([
        task.to_dict()
        for task in tasks
    ])

@task_bp.route("/my-tasks", methods=["GET"])
@jwt_required()
def my_tasks():

    user_id = get_jwt_identity()

    tasks = Task.query.filter_by(
        assigned_to=user_id
    ).all()

    return jsonify([
        task.to_dict()
        for task in tasks
    ]), 200

@task_bp.route("/<task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):

    task = Task.query.get(task_id)

    if not task:
        return jsonify({
            "message": "Task not found"
        }), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Task deleted successfully"
    }), 200




