from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restplus import Namespace, Resource, fields
from marshmallow.exceptions import MarshmallowError, RegistryError, ValidationError
# from models.category import Category
from models.listing import Listing
from models.user import User
from schemas.listing import ListingSchema
from sqlalchemy.exc import InternalError, NoResultFound, SQLAlchemyError

ITEM_NOT_FOUND = "Listing not found."

listing_ns = Namespace("listing", description="Listing related operations")
listings_ns = Namespace("listings", description="Listings related operations")

listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)

# Model required by flask_restplus for expect
listing_format = listings_ns.model(
    "Listing",
    {
        "title": fields.String("Title of Listing"),
        "description": fields.String("Description of Listing"),
        "price": fields.Fixed(decimals=2),
        "user_id": fields.Integer,
        "category_id": fields.Integer,
    },
)


class ListingAPI(Resource):
    def get(self, id):
        listing = Listing.find_by_id(id)
        if listing:
            return listing_schema.dump(listing)
        return {"message": ITEM_NOT_FOUND}, 404

    @jwt_required()
    def delete(self, id):
        try:
            user_id = get_jwt_identity()
            owner = User.find_by_id(user_id)
            listing = Listing.find_by_id(id)
            if listing:
                if listing.user_id == owner.id:
                    listing.delete_from_db()
                    return {"message": "Listing deleted successfully"}, 200
                else:
                    return {"message": "Deleting someone else's listing is forbidden"}, 403

            return {"message": ITEM_NOT_FOUND}, 404
        except (Exception, SQLAlchemyError, MarshmallowError, InternalError) as e:
            return {"message": "Something went wrong."}, 500

    @jwt_required()
    @listing_ns.expect(listing_format)
    def put(self, id):
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            owner = User.find_by_id(user_id)
            listing = Listing.find_by_id(id)
            # category = Category.find_by_id(body["category_id"])

            if listing:
                if listing.user_id == owner.id:
                    listing.title = body["title"]
                    listing.description = body["description"]
                    listing.price = body["price"]
                    listing.category_id = body["category_id"]
            else:
                listing = listing_schema.load(body)

            listing.save_to_db()
            return listing_schema.dump(listing), 200
        except ValidationError:
            return {"message": "Request is missing required fields."}, 400
        except (Exception, SQLAlchemyError, MarshmallowError, InternalError) as e:
            return {"message": "Something went wrong."}, 500


class ListingsAPI(Resource):
    @listings_ns.doc("Get all the Listings")
    def get(self):
        try:
            return listings_schema.dump(Listing.find_all()), 200
        except NoResultFound:
            return {"message": "No listings match this query."}, 410

    @jwt_required()
    @listings_ns.expect(listing_format)
    @listings_ns.doc("Create a Listing")
    def post(self):
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            owner = User.find_by_id(user_id)

            listing = listing_schema.load(body)

            listing.save_to_db()

            return listing_schema.dump(listing), 201
        except ValidationError:
            return {"message": "Request is missing required fields."}, 400
        except (Exception, SQLAlchemyError, MarshmallowError, InternalError) as e:
            return {"message": "Something went wrong."}, 500
