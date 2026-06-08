from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db
from app.models.connection_request import ConnectionRequest

connection_bp = Blueprint(
    "connections",
    __name__,
    url_prefix="/api/connections"
)


@connection_bp.route("/send", methods=["POST"])
@jwt_required()
def send_request():

    sender_id = get_jwt_identity()

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data provided"
        }), 400

    receiver_id = data.get("receiver_id")

    if not receiver_id:
        return jsonify({
            "message": "receiver_id is required"
        }), 400

    if sender_id == receiver_id:
        return jsonify({
            "message": "Cannot connect with yourself"
        }), 400

    existing = ConnectionRequest.query.filter_by(
        sender_id=sender_id,
        receiver_id=receiver_id
    ).first()

    if existing:
        return jsonify({
            "message": "Request already sent"
        }), 400

    request_obj = ConnectionRequest(
        sender_id=sender_id,
        receiver_id=receiver_id
    )

    db.session.add(request_obj)
    db.session.commit()

    return jsonify({
        "message": "Request sent successfully"
    }), 201


@connection_bp.route("/pending", methods=["GET"])
@jwt_required()
def pending_requests():

    user_id = get_jwt_identity()

    requests = ConnectionRequest.query.filter_by(
        receiver_id=user_id,
        status="pending"
    ).all()

    result = []

    for req in requests:
        result.append({
            "id": req.id,
            "sender_id": req.sender_id,
            "receiver_id": req.receiver_id,
            "status": req.status
        })

    return jsonify(result), 200


@connection_bp.route("/accept/<request_id>", methods=["PUT"])
@jwt_required()
def accept_request(request_id):

    current_user = get_jwt_identity()

    request_obj = ConnectionRequest.query.get(
        request_id
    )

    if not request_obj:
        return jsonify({
            "message": "Request not found"
        }), 404

    if request_obj.receiver_id != current_user:
        return jsonify({
            "message": "Unauthorized"
        }), 403

    request_obj.status = "accepted"

    db.session.commit()

    return jsonify({
        "message": "Request accepted"
    }), 200


@connection_bp.route("/reject/<request_id>", methods=["PUT"])
@jwt_required()
def reject_request(request_id):

    current_user = get_jwt_identity()

    request_obj = ConnectionRequest.query.get(
        request_id
    )

    if not request_obj:
        return jsonify({
            "message": "Request not found"
        }), 404

    if request_obj.receiver_id != current_user:
        return jsonify({
            "message": "Unauthorized"
        }), 403

    request_obj.status = "rejected"

    db.session.commit()

    return jsonify({
        "message": "Request rejected"
    }), 200