import os
import re

from flask import Blueprint, Flask, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restplus import Api
from marshmallow import ValidationError

from database.db import db
from database.ma import ma
from resources.auth import (
    SignInApi,
    SignOutApi,
    SignUpApi,
    signin_ns,
    signout_ns,
    signup_ns,
)
from resources.category import CategoriesAPI, CategoryAPI, categories_ns, category_ns
from resources.listing import ListingAPI, ListingsAPI, listing_ns, listings_ns
from resources.user import UserAPI, UsersAPI, user_ns, users_ns

# Heroku-specific postgresql config
uri = os.getenv("DATABASE_URL")
if uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)


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
# basedir = os.path.abspath(os.path.dirname(__file__))


# Initialize `Blueprint API`
bluePrint = Blueprint("api", __name__, url_prefix="/api")
api = Api(bluePrint, doc="/doc", title="Ring's Listings Restful Backend API")
app.register_blueprint(bluePrint)


# Apply database configs
# Development DB
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "db.sqlite")

# Production DB
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["PROPAGATE_EXCEPTIONS"] = True

# Launch JWT manager `jwt`
# app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Initialize `bcrypt`
bcrypt = Bcrypt(app)

# Initialize `CORS` and cors configs
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get("SECRET_KEY")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

# Launch Database
# initialize_db(app)

# Launch Marshmallow serializer
# initialize_ma(app)

# Launch Swagger-ui namespaces
# initialize_namespaces()

api.add_namespace(listing_ns)
api.add_namespace(listings_ns)
api.add_namespace(category_ns)
api.add_namespace(categories_ns)
api.add_namespace(signup_ns)
api.add_namespace(signin_ns)
api.add_namespace(signout_ns)
api.add_namespace(users_ns)
api.add_namespace(user_ns)

# Initialize database table base
@app.before_first_request
def create_tables():
    db.create_all()


# Initialize error handler
@api.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify(error.messages), 400


# Launch routes
# initialize_routes()
listing_ns.add_resource(ListingAPI, "/<int:id>")
listings_ns.add_resource(ListingsAPI, "")
category_ns.add_resource(CategoryAPI, "/<int:id>")
categories_ns.add_resource(CategoriesAPI, "")
signup_ns.add_resource(SignUpApi, "")
signin_ns.add_resource(SignInApi, "")
signout_ns.add_resource(SignOutApi, "")
user_ns.add_resource(UserAPI, "/<int:id>")
users_ns.add_resource(UsersAPI, "")

db.init_app(app)
ma.init_app(app)

# Heroku `run` init.
if __name__ == "__main__":

    app.run()
