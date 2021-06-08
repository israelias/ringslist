import { GetStaticProps, GetStaticPaths } from 'next';

import Feed from '../../components/Feed';
import Layout from '../../components/Layout';

import { Listing, Category } from '../../interfaces';

type Props = {
  listings: Listing[];
  categories: Category[];
  category: string;
};

const Category = ({ listings, categories, category }: Props) => {
  return (
    <Layout
      title={`RingsListings: ${category}`}
      categories={categories}
    >
      <Feed listings={listings} />
    </Layout>
  );
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch('http://127.0.0.1:8000/api/category');
  const listings = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = listings.map((listing: Listing) => ({
    params: { slug: listing.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.slug;
  const res = await fetch(
    `http:/localhost:5000/api/category/${category}`
  );
  const listings = await res.json();

  const ress = await fetch('http://localhost:5000/api/categories');
  const categories = await ress.json();

  return {
    props: {
      category,
      listings,
      categories,
    },
  };
};

export default Category;
