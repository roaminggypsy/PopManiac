import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const axios = require('axios');

export default function Playlists(props) {
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
    <div id='landing'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4 col-md-offset-2 text-center'>
            <h2>Create a Playlist</h2>

            <p className='lead'>
              Start a session and let your friends contribute to the vibes
            </p>
            <button className='btn btn-lg btn-primary' onClick={createQueue}>
              Create <i className='glyphicon glyphicon-plus'></i>
            </button>
          </div>

          <div className='col-md-4 text-center'>
            <h2>Join a Playlist</h2>

            <p className='lead'>Join an already existing session and jam</p>
            <Link to={'/playlists/join'} className='btn btn-lg btn-primary'>
              Join <i className='glyphicon glyphicon-play'></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
