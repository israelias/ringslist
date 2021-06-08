import datetime
from typing import List

from database.db import db
from flask_bcrypt import check_password_hash, generate_password_hash


class Listing(db.Model):
    __tablename__ = "listing"

    id = db.Column(db.Integer, primary_key=True)
    # ad_id = db.Column(db.Integer, unique=True, default=datetime.datetime.utcnow)
    title = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(300))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship(
        "User",
    )
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"))
    category = db.relationship(
        "Category",
    )

    def __init__(self, title, description, user_id, category_id):
        self.title = title
        self.description = description
        self.user_id = user_id
        self.category_id = category_id

    def __repr__(self):
        return "Listing(title=%s, description=%s, user_id=%s, category_id=%s)" % (
            self.title,
            self.description,
            self.user_id,
            self.category_id,
        )

    def json(self):
        return {
            "title": self.title,
            "description": self.description,
            "owner": self.user_id,
            "category": self.category_id,
        }

    @classmethod
    def find_by_title(cls, title) -> "Listing":
        return cls.query.filter_by(title=title).first()

    @classmethod
    def find_by_id(cls, _id) -> "Listing":
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all(cls) -> List["Listing"]:
        return cls.query.all()

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()

    def __str__(self):
        return self.title
