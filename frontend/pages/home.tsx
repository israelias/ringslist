import Layout from '../components/Layout';
import ListingCard from '../components/Card';
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
        {/* <Feed listings={listings} /> */}
        <ListingCard listings={listings} />
      </main>
    </Layout>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    'https://rlist-backend.herokuapp.com/api/listings'
  );
  const listings = await res.json();

  const ress = await fetch(
    'https://rlist-backend.herokuapp.com/api/categories'
  );
  const categories = await ress.json();

  return {
    props: {
      listings,
      categories,
    },
  };
}

export default Home;
