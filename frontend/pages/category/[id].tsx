import { GetStaticProps, GetStaticPaths } from 'next';

import ListingCard from '../../components/Card';
import Layout from '../../components/Layout';

import { Category } from '../../interfaces';

type Props = {
  category_listings: Category;
  categories: Category[];
  category: string;
  category_name: string;
};

const CategoryPage = ({
  category_listings,
  categories,
  category,
}: Props) => {
  if (
    !category_listings ||
    category_listings?.listings?.length === 0
  ) {
    return <p>No Listings.</p>;
  }
  const listings = category_listings.listings;
  return (
    <Layout
      title={`RingsListings: ${category}`}
      categories={categories}
    >
      <ListingCard listings={listings} />
    </Layout>
  );
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch(
    'https://rlist-backend.herokuapp.com/api/categories'
  );
  const categories = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = categories.map((category: Category) => ({
    params: { id: category.id.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.id.toString();
  const res = await fetch(
    `https://rlist-backend.herokuapp.com/api/category/${category}`
  );
  const category_listings = await res.json();

  const ress = await fetch(
    'https://rlist-backend.herokuapp.com/api/categories'
  );
  const categories = await ress.json();

  return {
    props: {
      category,

      category_listings,
      categories,
    },
  };
};

export default CategoryPage;
