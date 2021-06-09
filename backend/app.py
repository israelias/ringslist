import os

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


if not os.path.exists("env.py"):
    pass
else:
    import env

# init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

# bluprint
bluePrint = Blueprint("api", __name__, url_prefix="/api")
api = Api(bluePrint, doc="/doc", title="Sample Flask-RestPlus Application")
app.register_blueprint(bluePrint)

# database configs
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "db.sqlite")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["PROPAGATE_EXCEPTIONS"] = True

# jwt
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
jwt = JWTManager(app)

# bcrypt
bcrypt = Bcrypt(app)

# Cors
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get("SECRET_KEY")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")


# init db
# db = SQLAlchemy(app)
# initialize_db(app)

# init ma
# ma = Marshmallow(app)
# initialize_ma(app)

api.add_namespace(listing_ns)
api.add_namespace(listings_ns)
api.add_namespace(category_ns)
api.add_namespace(categories_ns)
api.add_namespace(signup_ns)
api.add_namespace(signin_ns)
api.add_namespace(signout_ns)
api.add_namespace(users_ns)
api.add_namespace(user_ns)


@app.before_first_request
def create_tables():
    db.create_all()


@api.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify(error.messages), 400


listing_ns.add_resource(ListingAPI, "/<int:id>")
listings_ns.add_resource(ListingsAPI, "")
category_ns.add_resource(CategoryAPI, "/<int:id>")
categories_ns.add_resource(CategoriesAPI, "")
signup_ns.add_resource(SignUpApi, "")
signin_ns.add_resource(SignInApi, "")
signout_ns.add_resource(SignOutApi, "")
user_ns.add_resource(UserAPI, "/<int:id>")
users_ns.add_resource(UsersAPI, "")

if __name__ == "__main__":
    db.init_app(app)
    ma.init_app(app)
    app.run(debug=True)
