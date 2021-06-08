from database.ma import ma
from models.category import Category
from models.listing import Listing

from schemas.listing import ListingSchema


class CategorySchema(ma.SQLAlchemyAutoSchema):  # noqa
    listings = ma.Nested(ListingSchema, many=True)

    class Meta:
        model = Category
        load_instance = True
        include_fk = True
