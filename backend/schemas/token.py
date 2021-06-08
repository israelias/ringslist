from database.ma import ma
from models.token import TokenBlocklist
from models.user import User


class TokenSchema(ma.SQLAlchemyAutoSchema):  # noqa
    class Meta:
        model = TokenBlocklist
        load_instance = True
        load_only = ("user",)
        include_fk = True
