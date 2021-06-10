import { User, Listing, Category } from '../interfaces';

const getUsers = async () => {
  const res = await fetch(
    'https://rlist-backend.herokuapp.com/api/users'
  );
  const usersData = await res.json();

  const usersNames = usersData.map((user: User) => ({
    member: { username: user.username, userId: user.id },
  }));
  return {
    props: { usersNames },
  };
};

const getListings = async () => {
  const res = await fetch(
    'https://rlist-backend.herokuapp.com/api/listings'
  );
  const listingsData = await res.json();

  const allListings = listingsData.map((listing: Listing) => ({
    listing: {
      title: listing.title,
      listingId: listing.id,
      userId: listing.user_id,
      categoryId: listing.category_id,
    },
  }));
  return {
    props: { allListings },
  };
};

const getCategories = async () => {
  const res = await fetch(
    'https://rlist-backend.herokuapp.com/api/categories'
  );
  const categoriesData = await res.json();

  const allCategories = categoriesData.map((category: Category) => ({
    listing: {
      name: category.name,
      categoryId: category.id,
    },
  }));
  return {
    props: { allCategories },
  };
};

export { getUsers, getListings, getCategories };
