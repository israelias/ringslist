from database.ma import ma
from models.category import Category
from models.listing import Listing


class ListingSchema(ma.SQLAlchemyAutoSchema):  # noqa
    class Meta:
        model = Listing
        load_instance = True
        load_only = ("category", "user")
        include_fk = True
