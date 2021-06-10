import Registration from '../components/Registration';
import Layout from '../components/Layout';

import { Listing, Category } from '../interfaces';

type Props = {
  categories: Category[];
};

const RegistrationPage = ({ categories }: Props) => {
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
  const ress = await fetch(
    'https://rlist-backend.herokuapp.com/api/categories'
  );
  const categories = await ress.json();

  return {
    props: {
      categories,
    },
  };
}

export default RegistrationPage;
