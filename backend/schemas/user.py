from database.ma import ma
from models.user import User

from schemas.listing import ListingSchema
from schemas.token import TokenSchema


class UserSchema(ma.SQLAlchemyAutoSchema):  # noqa
    listings = ma.Nested(ListingSchema, many=True)
    tokens = ma.Nested(TokenSchema, many=True)

    class Meta:
        model = User
        load_instance = True
        include_fk = True
