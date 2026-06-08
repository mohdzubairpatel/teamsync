from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()


def create_app():

    app = Flask(__name__)

    app.config["SECRET_KEY"] = "secret"

    app.config["SQLALCHEMY_DATABASE_URI"] = \
        "mysql+pymysql://root:password@localhost:3306/teamsync"

    app.config["JWT_SECRET_KEY"] = "jwt-secret"

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    CORS(app)

    # Import models HERE
    with app.app_context():
        from app.models.user import User

    @app.route("/")
    def home():
        return {
            "project": "TeamSync",
            "status": "running"
        }

    return app