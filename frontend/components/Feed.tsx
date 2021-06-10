import Link from 'next/link';

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Container,
  Box,
} from '@material-ui/core';

import { useStyles } from '../styles/listings.styles';

import { Listing } from '../interfaces';

type Props = {
  listings: Listing[];
};

const Feed = ({ listings }: Props) => {
  const classes = useStyles();
  return (
    <>
      <main>
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={2}>
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`listing/${encodeURIComponent(listing.id)}`}
              >
                <Grid item xs={6} sm={4} md={3}>
                  <Card
                    className={classes.card}
                    elevation={0}
                    style={{ cursor: 'pointer' }}
                  >
                    <CardContent>
                      <Typography
                        gutterBottom
                        component="h4"
                        variant="h5"
                      >
                        {listing.title}
                      </Typography>
                      <Typography gutterBottom component="p">
                        {listing.description}
                      </Typography>
                      <Box
                        component="p"
                        fontSize={16}
                        fontWeight={900}
                      >
                        ₱ {listing.price}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Link>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default Feed;
