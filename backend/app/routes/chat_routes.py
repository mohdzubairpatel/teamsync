from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.message import Message
from app.models.connection_request import ConnectionRequest

chat_bp = Blueprint(
    "chat",
    __name__,
    url_prefix="/api/chat"
)


@chat_bp.route("/send", methods=["POST"])
@jwt_required()
def send_message():

    sender_id = get_jwt_identity()

    data = request.get_json()

    receiver_id = data.get("receiver_id")
    text = data.get("message")

    if not receiver_id:
        return jsonify({
            "message": "receiver_id required"
        }), 400

    if not text:
        return jsonify({
            "message": "message required"
        }), 400

    connection = ConnectionRequest.query.filter(
        (
            (ConnectionRequest.sender_id == sender_id) &
            (ConnectionRequest.receiver_id == receiver_id)
        ) |
        (
            (ConnectionRequest.sender_id == receiver_id) &
            (ConnectionRequest.receiver_id == sender_id)
        ),
        ConnectionRequest.status == "accepted"
    ).first()

    if not connection:
        return jsonify({
            "message": "Users are not connected"
        }), 403

    msg = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        message=text
    )

    db.session.add(msg)
    db.session.commit()

    return jsonify({
        "message": "Message sent"
    }), 201


@chat_bp.route("/conversation/<user_id>", methods=["GET"])
@jwt_required()
def get_conversation(user_id):

    current_user = get_jwt_identity()

    messages = Message.query.filter(
        (
            (Message.sender_id == current_user) &
            (Message.receiver_id == user_id)
        ) |
        (
            (Message.sender_id == user_id) &
            (Message.receiver_id == current_user)
        )
    ).order_by(
        Message.created_at.asc()
    ).all()

    result = []

    for msg in messages:
        result.append({
            "id": msg.id,
            "sender_id": msg.sender_id,
            "receiver_id": msg.receiver_id,
            "message": msg.message,
            "created_at": msg.created_at
        })

    return jsonify(result), 200