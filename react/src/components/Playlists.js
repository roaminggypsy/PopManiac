import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const axios = require('axios');

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: '10%',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function Playlists(props) {
  const classes = useStyles();

  let history = useHistory();
  function createQueue() {
    axios
      .post('/api/playlist/create')
      .then(function (response) {
        const playlist = response.data.playlist;
        console.log(playlist);
        history.push(
          '/playlists/' + playlist._id + '/master?key=' + playlist.masterKey
        );
      })
      .catch(function (error) {})
      .then(function () {});
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Card className={classes.root}>
          <CardContent>
            <Typography variant='h5' component='h2'>
              Create a Playlist
            </Typography>
            <Typography variant='body2' component='p'>
              Start a session and let your friends contribute to the vibes
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small' onClick={createQueue}>
              Let's create
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card className={classes.root}>
          <CardContent>
            <Typography variant='h5' component='h2'>
              Join a Playlist
            </Typography>
            <Typography variant='body2' component='p'>
              Join an already existing session and jam
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small'>
              <Link to={'/playlists/join'} style={{ textDecoration: 'none' }}>
                Let's go
              </Link>
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
