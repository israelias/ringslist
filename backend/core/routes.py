from resources.auth import (
    SignInApi,
    SignOutApi,
    SignUpApi,
    signin_ns,
    signout_ns,
    signup_ns,
)
from resources.category import CategoriesAPI, CategoryAPI, categories_ns, category_ns
from resources.listing import ListingAPI, ListingsAPI, listing_ns, listings_ns
from resources.user import UserAPI, UsersAPI, user_ns, users_ns


def initialize_routes():
    listing_ns.add_resource(ListingAPI, "/<int:id>")
    listings_ns.add_resource(ListingsAPI, "")
    category_ns.add_resource(CategoryAPI, "/<int:id>")
    categories_ns.add_resource(CategoriesAPI, "")
    signup_ns.add_resource(SignUpApi, "")
    signin_ns.add_resource(SignInApi, "")
    signout_ns.add_resource(SignOutApi, "")
    user_ns.add_resource(UserAPI, "/<int:id>")
    users_ns.add_resource(UsersAPI, "")
