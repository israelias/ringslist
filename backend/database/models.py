from .db import db
from flask_bcrypt import generate_password_hash, check_password_hash
import datetime


class Category(db.model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)

    def __init__(self, name):
        self.name = name


class User(db.model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password = db.StringField(required=True, min_length=6)

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode("utf8")

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __init__(self, name):
        self.name = name


class Listing(db.model):
    id = db.Column(db.Integer, primary_key=True)
    ad_id = db.Column(db.Integer, unique=True, default=datetime.datetime.utcnow)
    title = db.Column(db.String(100), unique=True)
    description = db.Column(db.String(300))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship("User", backref="listings")
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"))
    category = db.relationship("Category", backref="listings")

    def __init__(self, title, description, owner, category):
        self.title = title
        self.description = description
        self.owner = owner
        self.category = category
