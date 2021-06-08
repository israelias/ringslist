import Link from 'next/link';

import {
  Card,
  CardMedia,
  CardContent,
  Grid,
  Typography,
  Container,
  Box,
} from '@material-ui/core';

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
                    {listing.image && (
                      <CardMedia
                        className={classes.cardMedia}
                        // component="img"
                        image={listing.image[0].image}
                        title={listing.image[0].alt_text}
                        // alt={post.product_image[0].alt_text}
                      />
                    )}
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
