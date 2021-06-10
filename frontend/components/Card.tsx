import React from 'react';
import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useUserContext } from '../context/user.context';
import { useDataHandler } from '../context/data.context';
import { Listing } from '../interfaces';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));
type Props = {
  listings: Listing[];
};
const ListingCard = ({ listings }: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const { userId } = useUserContext();
  const { setEditing, setId, setHeading } = useDataHandler();
  return (
    <Container className={classes.cardGrid} maxWidth="lg">
      <Grid container spacing={4}>
        {listings.map((listing) => (
          <Grid item key={listing.id} xs={6} sm={4} md={3} lg={3}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h4">
                  {listing.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <Typography variant="overline">₱</Typography>{' '}
                  {listing.price}
                </Typography>
                <Typography variant="body2">
                  {listing.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() =>
                    router.push({
                      pathname: `/listing/${encodeURIComponent(
                        listing.id
                      )}`,
                    })
                  }
                >
                  View
                </Button>
                {userId === listing.user_id && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                      setEditing(true);
                      setId(listing.id);
                      setHeading(`Editing ${listing.title}`);
                      router.push({
                        pathname: `/edit/${encodeURIComponent(
                          listing.id
                        )}`,
                      });
                    }}
                  >
                    Edit
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListingCard;
