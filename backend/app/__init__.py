from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from flask_socketio import SocketIO


import os
from dotenv import load_dotenv

load_dotenv()


db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

socketio = SocketIO(
    cors_allowed_origins="*"
)


def create_app():

    flask_app = Flask(__name__)

    flask_app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY"
   )

    flask_app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
  )

    flask_app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL"
  )

    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    

    db.init_app(flask_app)
    bcrypt.init_app(flask_app)
    jwt.init_app(flask_app)
    migrate.init_app(flask_app, db)

    socketio.init_app(
        flask_app,
        cors_allowed_origins="*"
    )

    CORS(flask_app)

    with flask_app.app_context():
        import app.models
        import app.socket_events

    from app.routes.auth_routes import auth_bp
    from app.routes.profile_routes import profile_bp
    from app.routes.skill_routes import skill_bp
    from app.routes.search_routes import search_bp
    from app.routes.connection_routes import connection_bp
    from app.routes.chat_routes import chat_bp
    from app.routes.team_routes import team_bp
    from app.routes.task_routes import task_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.team_invitation_routes import invitation_bp
    from app.routes.notification_routes import notification_bp
    from app.routes.activity_routes import activity_bp
    from app.routes.analytics_routes import analytics_bp
    from app.routes.announcement_routes import announcement_bp
    from app.routes.team_request_routes import request_bp


    flask_app.register_blueprint(auth_bp)
    flask_app.register_blueprint(profile_bp)
    flask_app.register_blueprint(skill_bp)
    flask_app.register_blueprint(search_bp)
    flask_app.register_blueprint(connection_bp)
    flask_app.register_blueprint(chat_bp)
    flask_app.register_blueprint(team_bp)
    flask_app.register_blueprint(task_bp)
    flask_app.register_blueprint(dashboard_bp)
    flask_app.register_blueprint(invitation_bp)
    flask_app.register_blueprint(notification_bp)
    flask_app.register_blueprint(activity_bp)
    flask_app.register_blueprint(analytics_bp)
    flask_app.register_blueprint(announcement_bp)
    flask_app.register_blueprint(request_bp)
    

    @flask_app.route("/")
    def home():
        return {
            "project": "TeamSync",
            "status": "running",
            "version": "1.0"
        }
    
    for rule in flask_app.url_map.iter_rules():
        print(rule)

    return flask_app