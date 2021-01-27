import React from 'react';
import YouTube from 'react-youtube';

import './Song.css';

export default function Song(props) {
  function deleteSong() {
    props.socket.emit(
      'song:remove',
      props.playlistId,
      props.masterKey,
      props.song._id
    );
  }

  const isTopSong = props.index === 0;
  const isMaster = props.isMaster;
  const song = props.song;
  const opts = {
    playeVars: {
      autoplay: 1,
    },
  };

  return (
    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h4>
          {song.title} by {song.artist}
        </h4>
      </div>

      <div className='panel-body'>
        {isTopSong && isMaster ? (
          <YouTube
            videoId={song.yt_id}
            opts={opts}
            onEnd={deleteSong}
            className='yt'
          />
        ) : (
          <img
            src={'http://img.youtube.com/vi/' + song.yt_id + '/hqdefault.jpg'}
            alt={song.title + ' by ' + song.artist}
            className='img-responsive'
          />
        )}
      </div>

      {isMaster ? (
        <div className='panel-footer text-right'>
          <button className='btn btn-danger' onClick={deleteSong}>
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
