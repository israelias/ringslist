import { GetServerSideProps } from 'next';

import Feed from '../../components/Feed';
import Layout from '../../components/Layout';

import { Category, User } from '../../interfaces';

type Props = {
  user_listings: User;
  categories: Category[];
  user: string;
  category_name: string;
};

const UserPage = ({ user_listings, categories, user }: Props) => {
  if (!user_listings || user_listings?.listings?.length === 0) {
    return <p>No Listings.</p>;
  }
  const listings = user_listings.listings;
  return (
    <Layout title={`RingsListings: ${user}`} categories={categories}>
      <Feed listings={listings} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
}) => {
  const user = params?.id.toString();
  const res = await fetch(
    `https://rlist-backend.herokuapp.com/api/user/${user}`
  );
  const user_listings = await res.json();

  const ress = await fetch(
    'https://rlist-backend.herokuapp.com/api/categories'
  );
  const categories = await ress.json();

  return {
    props: {
      user,
      user_listings,
      categories,
    },
  };
};

export default UserPage;
