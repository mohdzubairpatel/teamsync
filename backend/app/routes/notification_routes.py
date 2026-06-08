from flask import Blueprint
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.notification import Notification

notification_bp = Blueprint(
    "notifications",
    __name__,
    url_prefix="/api/notifications"
)

@notification_bp.route("/my-notifications", methods=["GET"])
@jwt_required()
def my_notifications():

    user_id = get_jwt_identity()

    notifications = Notification.query.filter_by(
        user_id=user_id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    result = []

    for notification in notifications:
        result.append(notification.to_dict())

    return jsonify(result), 200


@notification_bp.route("/read/<notification_id>", methods=["PUT"])
@jwt_required()
def mark_as_read(notification_id):

    notification = Notification.query.get(
        notification_id
    )

    if not notification:
        return jsonify({
            "message": "Notification not found"
        }), 404

    notification.is_read = True

    db.session.commit()

    return jsonify({
        "message": "Notification marked as read"
    }), 200

