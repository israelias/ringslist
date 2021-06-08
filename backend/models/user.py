import datetime
from typing import List

from database.db import db
from flask_bcrypt import check_password_hash, generate_password_hash


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(10), nullable=False)
    listings = db.relationship("Listing", lazy="dynamic", primaryjoin="User.id == Listing.user_id")
    tokens = db.relationship("TokenBlocklist", lazy="dynamic", primaryjoin="User.id == TokenBlocklist.user_id")

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return "User(username=%s)" % self.name

    def __str__(self):
        return self.username

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode("utf8")

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @classmethod
    def find_by_username(cls, username) -> "User":
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, _id) -> "User":
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all(cls) -> List["User"]:
        return cls.query.all()

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()
