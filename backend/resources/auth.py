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

USERNAME_NOT_FOUND = "Username not found."
USERNAME_ALREADY_EXISTS = "Username '{}' Already exists."
UNAUTHORIZED_ERROR = "Username or password do not match."
REGISTRATION_SUCCESS = "Account Created"
SIGNIN_SUCCESS = "Welcome back, '{}'."

user_ns = Namespace("user", description="User Auth related ops")
user_schema = UserSchema()

# Model required by flask_restplus for expect
user_format = user_ns.model(
    "User",
    {
        "username": fields.String("Username of user"),
    },
)


class SignUpApi(Resource):
    @user_ns.expect(user_format)
    @user_ns.doc("Register User")
    def post(self):
        body = request.get_json()
        username = body["username"]
        if User.find_by_name(username):
            return {"message": USERNAME_ALREADY_EXISTS.format(username)}, 400
        user = user_schema.load(body)
        user.hash_password()
        user.save_to_db()

        expires = datetime.timedelta(hours=3)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)

        return {
            "message": REGISTRATION_SUCCESS,
            "access_token": access_token,
            "username": user.username,
        }, 200


class SignInApi(Resource):
    @user_ns.expect(user_format)
    @user_ns.doc("SignIn User")
    def post(self):
        body = request.get_json()
        user = User.query.get(username=body.get("username"))
        authorized = user.check_password(body.get("password"))

        if not authorized:
            return {"message": UNAUTHORIZED_ERROR}, 400

        expires = datetime.timedelta(hours=3)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)

        return {
            "message": SIGNIN_SUCCESS,
            "access_token": access_token,
            "username": user.username,
        }, 200


class SignOutApi(Resource):
    @jwt_required()
    @user_ns.expect(user_format)
    @user_ns.doc("SignOut User")
    def post(self):
        revoked_token = get_jwt()

        jti = revoked_token["jti"]
        user_id = revoked_token["sub"]
        created_ts = int(revoked_token["iat"])
        expires_ts = int(revoked_token["exp"])

        created = datetime.datetime.utcfromtimestamp(created_ts).strftime("%Y-%m-%d %H:%M:%S")
        expires = datetime.datetime.utcfromtimestamp(expires_ts).strftime("%Y-%m-%d %H:%M:%S")

        user = User.query.get(id=user_id)
        now = datetime.datetime.now(datetime.timezone.utc)

        block_token = TokenBlocklist(
            jti=jti,
            created_on=created,
            expires_on=expires,
            revoked_on=now,
            revoked_by=user,
        )

        block_token.save_to_db()

        return {"message": "JWT revoked"}, 200
