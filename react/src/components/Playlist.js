import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import AddSong from './AddSong';
import Song from './Song';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const axios = require('axios');
const socket = io('localhost:3000');

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Playlist(props) {
  const classes = useStyles();
  const [songs, setSongs] = useState(['b']);
  const [isMaster, setisMaster] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  console.log(songs);

  let query = useQuery();
  let history = useHistory();

  const playlistId = props.match.params.id;

  useEffect(() => {
    console.log('useEfffect');
    // equivalent of ComponentDidMount
    axios
      .get('/api/playlist/' + playlistId)
      .then(function (response) {
        if (response.data.notExist) {
          history.push('/playlists/join?invalid=true&bad_id=' + playlistId);
        } else {
          setSongs(response.data.songs);
        }
      })
      .catch(function (error) {})
      .then(function () {});

    axios
      .get('/api/playlist/' + playlistId + '/master/' + query.get('key'))
      .then(function (response) {
        if (response.data.isMaster) {
          setisMaster(true);
        } else {
          history.push('/playlists/' + playlistId);
        }
      })
      .catch(function (err) {})
      .then(function () {});

    setMasterKey(query.get('key'));

    // On connection, send a signal to join the playlist's stream
    socket.on('connect', (data) => {
      console.log('connectt!!');
      socket.emit('joinPlaylist', playlistId);
    });

    socket.on('connect_error', (error) => console.log(error));

    // When we receive a 'song:add' symbol, add the data to our song array
    socket.on('song:add', (song) => addSong(song));

    // When we receive a 'song:remove' symbol, remove the song from the array
    socket.on('song:remove', (_id) => removeSong(_id));

    return () => {
      socket.off('song:add');
      socket.off('song:remove');
      socket.disconnect();
    };
  }, []);

  function addSong(song) {
    console.log(song);
    console.log(songs);
    setSongs((prevSongs) => {
      return [...prevSongs, song];
    });
    console.log(songs);
  }

  function removeSong(id) {
    console.log(songs);
    console.log(id);
    setSongs((prevSongs) => prevSongs.filter((song) => song._id !== id));
  }

  const songElements = songs.map((song, i) => (
    <Song
      key={song._id}
      song={song}
      index={i}
      socket={socket}
      qId={playlistId}
      masterKey={masterKey}
      isMaster={isMaster}
      playlistId={playlistId}
    />
  ));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={7}>
        {songs.length !== 0 ? songElements : 'Empty'}
      </Grid>

      <Grid item xs={12} sm={5}>
        <Card className={classes.root}>
          <CardContent>
            <Typography
              className={classes.title}
              color='textSecondary'
              gutterBottom
            >
              Playlist ID: {playlistId}
            </Typography>
            <Typography className={classes.pos} color='textSecondary'>
              <label>Share URL (Share with friends)</label>

              <input
                className='form-control'
                type='text'
                value={window.location.host + '/playlists/' + playlistId}
                readOnly
              ></input>
            </Typography>
            {/* <Typography variant='body2' component='p'>
              {isMaster === true ? (
                <div>
                  <br />

                  <Alert
                    message={
                      'You are the master of this AuxQ! ' +
                      'This means you are the main source of audio and can delete songs. ' +
                      'Only way to access the master page is to use the master URL. ' +
                      'Keep this to yourself or to people you trust with control!'
                    }
                    type='info'
                    key='errorAlert'
                  />

                  <div>
                    You are the master of this AuxQ! This means you are the main
                    source of audio and can delete songs. Only way to access the
                    master page is to use the master URL. Keep this to yourself
                    or to people you trust with control!'
                  </div>

                  <label>Master URL (Keep for yourself)</label>

                  <input
                    className='form-control'
                    type='text'
                    value={
                      window.location.host +
                      '/playlists/' +
                      playlistId +
                      '/master?key=' +
                      masterKey
                    }
                    readOnly
                  ></input>
                </div>
              ) : null}
            </Typography> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <AddSong socket={socket} playlistId={playlistId} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
