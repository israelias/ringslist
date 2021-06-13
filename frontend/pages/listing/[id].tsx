import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import {
  Container,
  Paper,
  Grid,
  Box,
  Typography,
} from '@material-ui/core';

import Layout from '../../components/Layout';

import { useStyles } from '../../styles/listing.styles';
import { Listing, Category } from '../../interfaces';

type Props = {
  listing: Listing;
  categories: Category[];
};

function ListingPage({ listing, categories }: Props) {
  const classes = useStyles();
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={listing.title} categories={categories}>
      <Container maxWidth="md">
        <Grid className={classes.center} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paperImage} elevation={0}>
              <Typography gutterBottom component="p">
                {listing.description}
              </Typography>
            </Paper>
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
                From {listing.user_id}
              </Box>
              <Box component="p" mt={2} fontSize={14}>
                Free Delivery & Returns (Ts&Cs apply)
              </Box>
              <Box component="p" mt={2} fontSize={14}>
                do NOT contact me with unsolicited services or offers
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

// This also gets called at build time
export const getServerSideProps: GetServerSideProps = async ({
  params,
}) => {
  const res = await fetch(
    `https://rlist-backend.herokuapp.com/api/listing/${
      params && params.id.toString()
    }`
  );
  const listing = await res.json();

  const ress = await fetch(
    'https://rlist-backend.herokuapp.com/api/categories'
  );
  const categories = await ress.json();

  return {
    props: {
      listing,
      categories,
    },
  };
};

export default ListingPage;
