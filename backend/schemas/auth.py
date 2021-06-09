from database.ma import ma
from models.user import User


class AuthSchema(ma.SQLAlchemyAutoSchema):  # noqa
    username = ma.String()
    password = ma.String()

    class Meta:
        model = User
        load_instance = True
