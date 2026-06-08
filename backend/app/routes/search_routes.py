from flask import Blueprint
from flask import request
from flask import jsonify

from app import db

from app.models.user import User
from app.models.skill import Skill
from app.models.user_skill import UserSkill

search_bp = Blueprint(
    "search",
    __name__,
    url_prefix="/api/search"
)


@search_bp.route("/users", methods=["GET"])
def search_users():

    skill_name = request.args.get("skill")

    if not skill_name:
        return jsonify({
            "message": "Skill parameter required"
        }), 400

    users = db.session.query(
        User.id,
        User.name,
        User.email,
        User.profession,
        User.experience_level
    ).join(
        UserSkill,
        User.id == UserSkill.user_id
    ).join(
        Skill,
        Skill.id == UserSkill.skill_id
    ).filter(
        Skill.name.ilike(f"%{skill_name}%")
    ).all()

    result = []

    for user in users:

        result.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "profession": user.profession,
            "experience_level": user.experience_level
        })

    return jsonify(result)


@search_bp.route("/skills", methods=["GET"])
def search_skills():

    keyword = request.args.get("q")

    if not keyword:
        return jsonify([])

    skills = Skill.query.filter(
        Skill.name.ilike(f"%{keyword}%")
    ).all()

    result = []

    for skill in skills:

        result.append({
            "id": skill.id,
            "name": skill.name
        })

    return jsonify(result)