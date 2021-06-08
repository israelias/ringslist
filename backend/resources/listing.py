from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restplus import Namespace, Resource, fields
from models.listing import Listing
from models.user import User
from schemas.listing import ListingSchema

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
        "user_id": fields.Integer,
        # "user": fields.String("Username of owner"),
        "category_id": fields.Integer,
        # "category": fields.String("Category of Listing"),
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
        user_id = get_jwt_identity()
        owner = User.find_by_id(user_id)
        listing = Listing.query.get(id=id, user=owner)
        if listing:
            listing.delete_from_db()
            return {"message": "Listing deleted successfully"}, 200
        return {"message": ITEM_NOT_FOUND}, 404

    @jwt_required()
    @listing_ns.expect(listing_format)
    def put(self, id):
        user_id = get_jwt_identity()
        body = request.get_json()
        owner = User.find_by_id(user_id)
        listing = Listing.query.get(id=id, user=owner)

        if listing:
            listing.title = body["title"]
            listing.description = body["description"]
            listing.ad_id = body["ad_id"]
        else:
            listing = listing_schema.load(body)

        listing.save_to_db()
        return listing_schema.dump(listing), 200


class ListingsAPI(Resource):
    @listings_ns.doc("Get all the Listings")
    def get(self):
        return listings_schema.dump(Listing.find_all()), 200

    @jwt_required()
    @listings_ns.expect(listing_format)
    @listings_ns.doc("Create a Listing")
    def post(self):
        user_id = get_jwt_identity()
        body = request.get_json()
        listing = listing_schema.load(body)
        listing.save_to_db()

        return listing_schema.dump(listing), 201
