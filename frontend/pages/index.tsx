import Registration from '../components/Registration';
import Layout from '../components/Layout';

import { Listing, Category } from '../interfaces';

type Props = {
  listings: Listing[];
  categories: Category[];
};

const RegistrationPage = ({ listings, categories }: Props) => {
  return (
    <Layout
      title="RingsListings: Registration"
      categories={categories}
    >
      <main>
        <Registration />
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

export default RegistrationPage;
