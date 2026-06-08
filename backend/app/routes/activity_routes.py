from flask import Blueprint
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.models.activity import Activity

activity_bp = Blueprint(
    "activities",
    __name__,
    url_prefix="/api/activities"
)

@activity_bp.route("/my-activities", methods=["GET"])
@jwt_required()
def my_activities():

    user_id = get_jwt_identity()

    activities = Activity.query.filter_by(
        user_id=user_id
    ).order_by(
        Activity.created_at.desc()
    ).all()

    result = []

    for activity in activities:
        result.append(activity.to_dict())

    return jsonify(result), 200

