from flask_sqlalchemy import SQLAlchemy

# Initalize database
db = SQLAlchemy()


def initialize_db(app):
    db.init_app(app)
