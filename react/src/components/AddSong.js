import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  margin: 24px;
  padding: 16px;
`;

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
    <StyledCard>
      <CardHeader title='Add A Song'></CardHeader>

      <CardContent>
        {/* <ReactCSSTransitionGroup
          transitionName='alert'
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        > */}
        {error !== '' ? <div>{error}</div> : null}
        {/* </ReactCSSTransitionGroup> */}

        <TextField
          required
          id='standard-required'
          placeholder='Song Name'
          label='title'
          name='title'
          onChange={handleInputChange}
          value={title}
          fullWidth
          margin='normal'
        />

        <TextField
          required
          id='standard-required'
          placeholder='Artist'
          label='artist'
          name='artist'
          onChange={handleInputChange}
          value={artist}
          fullWidth
          margin='normal'
        />
        <TextField
          required
          id='standard-required'
          placeholder='URL'
          label='youtube'
          name='youtube'
          onChange={handleInputChange}
          value={youtube}
          fullWidth
          margin='normal'
        />

        {/* <input
            className='btn btn-md btn-primary text-right'
            type='submit'
            value='Add'
          ></input> */}
      </CardContent>
      <CardActions disableSpacing>
        <Button color='secondary' onClick={handleSubmit}>
          Add
        </Button>
      </CardActions>
    </StyledCard>
  );
}
