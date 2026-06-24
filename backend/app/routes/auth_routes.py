from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from app import db
from app import bcrypt

from app.models.user import User
from flask import jsonify

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data provided"
        }), 400

    required_fields = [
        "name",
        "email",
        "password"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "message": f"{field} is required"
            }), 400

    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 400

    hashed_password = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(
        name=data["name"],
        email=data["email"],
        password_hash=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data provided"
        }), 400

    if not data.get("email"):
        return jsonify({
            "message": "Email is required"
        }), 400

    if not data.get("password"):
        return jsonify({
            "message": "Password is required"
        }), 400

    user = User.query.filter_by(
        email=data["email"]
    ).first()

    if not user:
        return jsonify({
            "message": "Invalid credentials"
        }), 401

    valid_password = bcrypt.check_password_hash(
        user.password_hash,
        data["password"]
    )

    if not valid_password:
        return jsonify({
            "message": "Invalid credentials"
        }), 401

    token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
    "message": "Login successful",
    "token": token,
    "user_id": user.id,
    "name": user.name,
    "email": user.email,
    "role": user.role
}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():

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
    }), 200


@auth_bp.route("/users", methods=["GET"])
def get_users():

    users = User.query.all()

    return jsonify([
        {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
        for user in users
    ]), 200 