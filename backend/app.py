import os

from flask import Blueprint, Flask, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restplus import Api
from marshmallow import ValidationError

from database.db import db, initialize_db
from database.ma import initialize_ma, ma

if not os.path.exists("env.py"):
    pass
else:
    import env

# ===========================================================================
# *               `Flask App and Configs`
# ? Executes Flask app deployment
# Initializes app and packages by order of dependency requirements
# ===========================================================================


# Initialize `app`
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

# Import modules that require `app`
from core.routes import initialize_routes

# Initialize `Blueprint API`
bluePrint = Blueprint("api", __name__, url_prefix="/api")
api = Api(bluePrint, doc="/doc", title="Ring's Listings Restful Backend API")
app.register_blueprint(bluePrint)

# Import modules that require 'api'
from core.namespace import initialize_namespaces

# Apply database configs
# Development DB
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "db.sqlite")

# Production DB
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["PROPAGATE_EXCEPTIONS"] = True

# Launch JWT manager `jwt`
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Initialize `bcrypt`
bcrypt = Bcrypt(app)

# Initialize `CORS` and cors configs
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get("SECRET_KEY")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

# Launch Database
initialize_db(app)

# Launch Marshmallow serializer
initialize_ma(app)

# Launch Swagger-ui namespaces
initialize_namespaces()

# Initialize database table base
@app.before_first_request
def create_tables():
    db.create_all()


# Initialize error handler
@api.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify(error.messages), 400


# Launch routes
initialize_routes()


# Heroku `run` init.
if __name__ == "__main__":
    app.run()
