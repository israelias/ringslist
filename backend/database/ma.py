from flask_marshmallow import Marshmallow

# init ma
ma = Marshmallow()


def initialize_ma(app):
    ma.init_app(app)
