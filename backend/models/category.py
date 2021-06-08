import datetime
from typing import List

from database.db import db
from flask_bcrypt import check_password_hash, generate_password_hash


class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    listings = db.relationship("Listing", lazy="dynamic", primaryjoin="Category.id == Listing.category_id")

    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name

    def __repr__(self):
        return "Category(name=%s)" % self.name

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "listings": self.listings,
        }

    @classmethod
    def find_by_name(cls, name) -> "Category":
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_by_id(cls, _id) -> "Category":
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all(cls) -> List["Category"]:
        return cls.query.all()

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()
