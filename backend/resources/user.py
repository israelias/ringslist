import datetime

from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    jwt_required,
)
from flask_restplus import Namespace, Resource, fields
from models.token import TokenBlocklist
from models.user import User
from schemas.user import UserSchema

from .listing import listing_format

USER_NOT_FOUND = "User with matching id was not found."
USER_ALREADY_EXISTS = "User already exists."
UNAUTHORIZED_ERROR = "Username or password do not match."
REGISTRATION_SUCCESS = "Account Created"
SIGNIN_SUCCESS = "Welcome back, '{}'."

user_ns = Namespace("user", description="User related ops")
users_ns = Namespace("users", description="Users related ops")

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Model required by flask_restplus for expect
user_format = users_ns.model(
    "User",
    {
        "username": fields.String("Username of user"),
        "listings": fields.Nested(listing_format, skip_none=True),
    },
)


class UserAPI(Resource):
    def get(self, id):
        user = User.find_by_id(id)
        if user:
            return user_schema.dump(user)
        return {"message": USER_NOT_FOUND}, 404

    def delete(self, id):
        user = User.find_by_id(id)
        if user:
            user.delete_from_db()
            return {"message": "User deleted successfully"}, 200
        return {"message": USER_NOT_FOUND}, 404


class UsersAPI(Resource):
    @users_ns.doc("Get all users")
    def get(self):
        return users_schema.dump(User.find_all()), 200

    @users_ns.expect(user_format)
    @users_ns.doc("Add user")
    def post(self):
        body = request.get_json()
        username = body["username"]
        if User.find_by_username(username):
            return {"message": USER_ALREADY_EXISTS}, 400

        user = user_schema.load(body)
        user.save_to_db()

        return user_schema.dump(user), 201
