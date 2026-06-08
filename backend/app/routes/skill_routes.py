from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.skill import Skill
from app.models.user_skill import UserSkill

skill_bp = Blueprint(
    "skills",
    __name__,
    url_prefix="/api/skills"
)

@skill_bp.route("/add", methods=["POST"])
@jwt_required()
def add_skill():

    user_id = get_jwt_identity()

    data = request.get_json()

    skill_name = data.get("skill")

    if not skill_name:
        return jsonify({
            "message": "Skill is required"
        }), 400

    skill = Skill.query.filter_by(
        name=skill_name
    ).first()

    if not skill:

        skill = Skill(
            name=skill_name
        )

        db.session.add(skill)
        db.session.commit()

    existing = UserSkill.query.filter_by(
        user_id=user_id,
        skill_id=skill.id
    ).first()

    if existing:
        return jsonify({
            "message": "Skill already added"
        }), 400

    user_skill = UserSkill(
        user_id=user_id,
        skill_id=skill.id
    )

    db.session.add(user_skill)
    db.session.commit()

    return jsonify({
        "message": "Skill added successfully"
    }), 201

@skill_bp.route("/my-skills", methods=["GET"])
@jwt_required()
def my_skills():

    user_id = get_jwt_identity()

    skills = db.session.query(
        Skill.id,
        Skill.name
    ).join(
        UserSkill,
        Skill.id == UserSkill.skill_id
    ).filter(
        UserSkill.user_id == user_id
    ).all()

    result = []

    for skill in skills:

        result.append({
            "id": skill.id,
            "name": skill.name
        })

    return jsonify(result)

@skill_bp.route("/remove/<int:skill_id>", methods=["DELETE"])
@jwt_required()
def remove_skill(skill_id):

    user_id = get_jwt_identity()

    user_skill = UserSkill.query.filter_by(
        user_id=user_id,
        skill_id=skill_id
    ).first()

    if not user_skill:
        return jsonify({
            "message": "Skill not found"
        }), 404

    db.session.delete(user_skill)
    db.session.commit()

    return jsonify({
        "message": "Skill removed successfully"
    })