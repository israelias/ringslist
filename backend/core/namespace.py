from app import api
from resources.auth import (
    signin_ns,
    signout_ns,
    signup_ns,
)
from resources.category import categories_ns, category_ns
from resources.listing import listing_ns, listings_ns
from resources.user import user_ns, users_ns


def initialize_namespaces():
    api.add_namespace(listing_ns)
    api.add_namespace(listings_ns)
    api.add_namespace(category_ns)
    api.add_namespace(categories_ns)
    api.add_namespace(signup_ns)
    api.add_namespace(signin_ns)
    api.add_namespace(signout_ns)
    api.add_namespace(users_ns)
    api.add_namespace(user_ns)
