import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';

import {
  Container,
  Paper,
  Grid,
  Box,
  Hidden,
} from '@material-ui/core';

import Layout from '../../components/Layout';
import { useStyles } from '../../styles/listing.styles';
import { Listing, Category } from '../../interfaces';

type Props = {
  listing: Listing;
  categories: Category[];
};

function Listing({ listing, categories }: Props) {
  const classes = useStyles();
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={listing.title} categories={categories}>
      <Container maxWidth="md">
        <Grid container spacing={0}>
          <Hidden only={['xs', 'sm']}>
            <Grid item sm={1}>
              <Paper
                className={classes.paperImagePreview}
                elevation={0}
              >
                {listing.image?.map((c) => (
                  <div>
                    <Paper
                      className={classes.paperImage}
                      elevation={0}
                    >
                      <img
                        src={''}
                        alt={''}
                        className={classes.img}
                      />
                    </Paper>
                  </div>
                ))}
              </Paper>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={6}>
            {listing.image && (
              <Paper className={classes.paperImage} elevation={0}>
                <img
                  src={listing.image[0]?.image}
                  alt={listing.image[0].alt_text}
                  className={classes.img}
                />
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper className={classes.paperRight} elevation={0}>
              <Box component="h1" fontSize={18} fontWeight="400">
                {listing.title}
              </Box>
              <Box component="p" fontSize={22} fontWeight="900" m={0}>
                £{listing.price}
              </Box>
              <Box component="p" fontSize={22} fontWeight="900" m={0}>
                From {listing.user}
              </Box>
              <Box component="p" m={0} fontSize={14}>
                Free Delivery & Returns (Ts&Cs apply)
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch('http://localhost:5000/api/listings');
  const listings = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = listings.map((listing: Listing) => ({
    params: { slug: listing.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(
    `http://localhost:5000/api/listings/${params.slug}`
  );
  const listing = await res.json();

  const ress = await fetch('http://localhost:5000/api/categories');
  const categories = await ress.json();

  return {
    props: {
      listing,
      categories,
    },
  };
};

export default Listing;
