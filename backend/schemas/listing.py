from database.ma import ma
from models.listing import Category, Listing


class ListingSchema(ma.SQLAlchemyAutoSchema):  # noqa
    price = ma.Decimal(as_string=True, places=2, precision=4)

    class Meta:
        model = Listing
        load_instance = True
        load_only = ("category", "user")
        include_fk = True
