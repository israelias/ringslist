import Feed from '../components/Feed';
import Layout from '../components/Layout';

import { Listing, Category } from '../interfaces';

type Props = {
  listings: Listing[];
  categories: Category[];
};

const Home = ({ listings, categories }: Props) => {
  return (
    <Layout
      title="RingsListings: All Listings"
      categories={categories}
    >
      <main>
        <Feed listings={listings} />
      </main>
    </Layout>
  );
};

export async function getStaticProps() {
  const res = await fetch('http://localhost:5000/api/listings');
  const listings = await res.json();

  const ress = await fetch('http://localhost:5000/api/categories');
  const categories = await ress.json();

  return {
    props: {
      listings,
      categories,
    },
  };
}

export default Home;
