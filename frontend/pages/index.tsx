import Box from '@material-ui/core/Box';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { useStyles } from '../styles/listings.styles';
import Layout from '../components/Layout';

import { Listing, Category } from '../interfaces';

type Props = {
  listings: Listing[];
  categories: Category[];
};

const Home = ({ listings, categories }: Props) => {
  const classes = useStyles();
  return (
    <Layout
      title="RingsListings: All Listings"
      categories={categories}
    >
      <main>
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={2}>
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`listing/${encodeURIComponent(listing.slug)}`}
              >
                <Grid item xs={6} sm={4} md={3}>
                  <Card className={classes.card} elevation={0}>
                    <CardContent>
                      <Typography gutterBottom component="p">
                        {listing.title}, from {listing.user}
                      </Typography>
                      <Box
                        component="p"
                        fontSize={16}
                        fontWeight={900}
                      >
                        {listing.description}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Link>
            ))}
          </Grid>
        </Container>
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
