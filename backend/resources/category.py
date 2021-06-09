from database.db import db
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restplus import Namespace, Resource, fields
from models.category import Category
from schemas.category import CategorySchema

from .listing import listing_format

CATEGORY_NOT_FOUND = "Category not found."
CATEGORY_ALREADY_EXISTS = "Category '{}' Already exists."

category_ns = Namespace("category", description="Category related ops")
categories_ns = Namespace("categories", description="Categories related ops")

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


# Model required by flask_restplus for expect
category_format = categories_ns.model(
    "Category",
    {
        "name": fields.String("Name of Category"),
        # "listings": fields.Nested(listing_format, skip_none=True),
    },
)


class CategoryAPI(Resource):
    def get(self, id):
        category = Category.find_by_id(id)
        if category:
            return category_schema.dump(category)
        return {"message": CATEGORY_NOT_FOUND}, 404

    def delete(self, id):
        category = Category.find_by_id(id)
        if category:
            category.delete_from_db()
            return {"message": "Category Deleted successfully"}, 200
        return {"message": CATEGORY_NOT_FOUND}, 404


class CategoriesAPI(Resource):
    @categories_ns.doc("Get all Categories")
    def get(self):
        return categories_schema.dump(Category.find_all()), 200

    @categories_ns.expect(category_format)
    @categories_ns.doc("Add a Category")
    def post(self):
        body = request.get_json()
        name = body["name"]
        if Category.find_by_name(name):
            return {"message": CATEGORY_ALREADY_EXISTS.format(name)}, 400

        category = category_schema.load(body)
        category.save_to_db()

        return category_schema.dump(category), 201
