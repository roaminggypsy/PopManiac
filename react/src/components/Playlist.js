import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import AddSong from './AddSong';
import Song from './Song';

const axios = require('axios');
const socket = io('localhost:3000');

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Playlist(props) {
  const [songs, setSongs] = useState([]);
  const [isMaster, setisMaster] = useState(false);
  const [masterKey, setMasterKey] = useState('');

  let query = useQuery();
  let history = useHistory();

  const playlistId = props.match.params.id;

  useEffect(() => {
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

    // On connection, send a signal to join the playlist's stream
    socket.on('connect', (data) => {
      console.log('connectt!!');
      socket.emit('joinPlaylist', playlistId);
    });

    socket.on('connect_error', (error) => console.log(error));

    // When we receive a 'song:add' symbol, add the data to our song array
    socket.on('song:add', addSong);

    // When we receive a 'song:remove' symbol, remove the song from the array
    socket.on('song:remove', removeSong);

    // console.log(props);
    // console.log(query.get('key'));
    return () => socket.disconnect();
  }, []);

  function addSong(song) {
    setSongs([...songs, song]);
    console.log(songs);
  }

  function removeSong(id) {
    setSongs(songs.filter((song) => song._id !== id));
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
    />
  ));

  return (
    <div id='playlist'>
      <div className='container'>
        <div className='col-md-5 col-md-push-7'>
          <div className='panel panel-default'>
            <div className='panel-heading'>
              <h4>Playlist ID: {playlistId}</h4>
            </div>

            <div className='panel-body'>
              <label>Share URL (Share with friends)</label>

              <input
                className='form-control'
                type='text'
                value={window.location.host + '/q/' + playlistId}
                readOnly
              ></input>

              {isMaster === true ? (
                <div>
                  <br />

                  {/* <Alert
                    message={
                      'You are the master of this AuxQ! ' +
                      'This means you are the main source of audio and can delete songs. ' +
                      'Only way to access the master page is to use the master URL. ' +
                      'Keep this to yourself or to people you trust with control!'
                    }
                    type='info'
                    key='errorAlert'
                  /> */}

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
                      '/playlist/' +
                      playlistId +
                      '/master?key=' +
                      masterKey
                    }
                    readOnly
                  ></input>
                </div>
              ) : null}
            </div>
          </div>

          <AddSong socket={socket} playlistId={playlistId} />
        </div>

        <div className='col-md-7 col-md-pull-5'>
          {songs.length !== 0 ? songElements : 'Empty'}
        </div>
      </div>
    </div>
  );
}
