from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db
from app.models.user import User

profile_bp = Blueprint(
    "profile",
    __name__,
    url_prefix="/api/profile"
)


@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "profession": user.profession,
        "education": user.education,
        "experience_level": user.experience_level,
        "bio": user.bio,
        "role": user.role
    })


@profile_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json()

    user.profession = data.get(
        "profession",
        user.profession
    )

    user.education = data.get(
        "education",
        user.education
    )

    user.experience_level = data.get(
        "experience_level",
        user.experience_level
    )

    user.bio = data.get(
        "bio",
        user.bio
    )

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully"
    })