from flask_socketio import emit
from flask_socketio import join_room

from app import socketio


@socketio.on("join")
def handle_join(data):

    room = data["room"]

    join_room(room)

    emit(
        "status",
        {
            "message": f"Joined {room}"
        },
        room=room
    )


@socketio.on("send_message")
def handle_message(data):

    room = data["room"]

    emit(
        "receive_message",
        data,
        room=room
    )