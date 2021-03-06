import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import AddSong from './AddSong';
import Song from './Song';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
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

const StyledCard = styled(Card)`
  margin: 24px;
  padding: 16px;
`;

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
    socket.on('song:add', (song) => {
      setSongs((prevSongs) => {
        return [...prevSongs, song];
      });
    });

    // When we receive a 'song:remove' symbol, remove the song from the array
    socket.on('song:remove', (_id) => {
      console.log('here');
      setSongs((prevSongs) => prevSongs.filter((song) => song._id !== _id));
    });

    return () => {
      socket.off('song:add');
      socket.off('song:remove');
      socket.disconnect();
    };
  }, []);

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
        <StyledCard className={classes.root}>
          <CardHeader title='Playlist Info'>Playlist Info</CardHeader>

          <CardContent>
            <TextField
              id='filled-read-only-input'
              label='Playlist Id'
              InputProps={{
                readOnly: true,
              }}
              value={playlistId}
              fullWidth
              margin='normal'
            />
            <TextField
              id='filled-read-only-input'
              label='Share URL'
              InputProps={{
                readOnly: true,
              }}
              value={window.location.host + '/playlists/' + playlistId}
              fullWidth
              margin='normal'
            />
            {isMaster === true ? (
              <TextField
                id='filled-read-only-input'
                label='Master URL'
                InputProps={{
                  readOnly: true,
                }}
                value={
                  window.location.host +
                  '/playlists/' +
                  playlistId +
                  '/master?key=' +
                  masterKey
                }
                fullWidth
                margin='normal'
              />
            ) : null}
          </CardContent>
        </StyledCard>

        <AddSong socket={socket} playlistId={playlistId} />
      </Grid>
    </Grid>
  );
}
