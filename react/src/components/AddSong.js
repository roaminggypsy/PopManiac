import React, { useState } from 'react';

export default function AddSong(props) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [youtube, setYoutube] = useState('');
  const [error, setError] = useState('');

  function handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    if (name === 'title') {
      setTitle(value);
    } else if (name === 'artist') {
      setArtist(value);
    } else {
      setYoutube(value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const yt_id = validateYouTubeURL(youtube);

    if (title === undefined || title === '') {
      setError('Invalid title. ');
      return;
    }

    if (artist === undefined || artist === '') {
      setError('Invalid artist. ');
      return;
    }

    if (yt_id === false) {
      setError('Invalid URL. ');
      return;
    }

    const data = {
      title: title,
      artist: artist,
      yt_id: yt_id,
    };

    props.socket.emit('song:add', props.playlistId, data);

    setTitle('');
    setArtist('');
    setYoutube('');
    setError('');
  }

  function validateYouTubeURL(url) {
    if (url !== undefined || url !== '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length === 11) {
        return match[2];
      } else {
        return false;
      }
    }
  }

  return (
    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h4>Add Song</h4>
      </div>

      <div className='panel-body'>
        {/* <ReactCSSTransitionGroup
          transitionName='alert'
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        > */}
        {error !== '' ? <div>{error}</div> : null}
        {/* </ReactCSSTransitionGroup> */}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Title</label>

            <input
              className='form-control'
              type='text'
              placeholder='Love'
              name='title'
              onChange={handleInputChange}
              value={title}
            ></input>
          </div>

          <div className='form-group'>
            <label>Artist</label>

            <input
              className='form-control'
              type='text'
              placeholder='Lana Del Rey'
              name='artist'
              onChange={handleInputChange}
              value={artist}
            ></input>
          </div>

          <div className='form-group'>
            <label>YouTube URL</label>

            <input
              className='form-control'
              type='text'
              placeholder='https://youtu.be/3-NTv0CdFCk'
              name='youtube'
              onChange={handleInputChange}
              value={youtube}
            ></input>
          </div>

          <input
            className='btn btn-md btn-primary text-right'
            type='submit'
            value='Add'
          ></input>
        </form>
      </div>
    </div>
  );
}
