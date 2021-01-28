import React, { useState } from 'react';
import YouTube from 'react-youtube';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardHeader';
import styled from 'styled-components';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import './Song.css';

const StyledCard = styled(Card)`
  margin: 24px;
  padding: 16px;
`;

export default function Song(props) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(props.song.title);
  const [artist, setArtist] = React.useState(props.song.artist);
  const [ytId, setYtId] = React.useState(props.song.yt_id);

  console.log(props.song);

  function deleteSong() {
    props.socket.emit(
      'song:remove',
      props.playlistId,
      props.masterKey,
      props.song._id
    );
  }

  function openEditModal() {
    setOpen(true);
  }

  function closeEditModal() {
    props.socket.emit(
      'song:update',
      props.playlistId,
      props.masterKey,
      props.song._id,
      title,
      artist,
      ytId
    );
  }

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'artist') {
      setArtist(value);
    } else {
      setYtId(value);
    }
  }

  const isMaster = props.isMaster;
  const song = props.song;
  const opts = {
    playeVars: {
      autoplay: 1,
    },
  };

  return (
    <StyledCard>
      <CardHeader
        title={title + ' by ' + artist}
        action={
          isMaster ? (
            <span>
              <EditIcon
                style={{ 'margin-right': '30px' }}
                onClick={openEditModal}
              />
              <DeleteIcon onClick={deleteSong} />
            </span>
          ) : null
        }
      />

      <YouTube
        videoId={song.yt_id}
        opts={opts}
        onEnd={deleteSong}
        className='yt'
      />

      <Dialog
        open={open}
        onClose={closeEditModal}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Edit</DialogTitle>
        <DialogContent>
          <TextField
            margin='normal'
            label='Title'
            id='title'
            name='title'
            type='text'
            fullWidth
            value={title}
            onChange={handleInputChange}
          />
          <TextField
            margin='normal'
            label='Artist'
            id='artist'
            name='artist'
            type='text'
            fullWidth
            value={artist}
            onChange={handleInputChange}
          />
          <TextField
            margin='normal'
            label='Youtube IDs'
            name='ytId'
            id='ytId'
            type='text'
            fullWidth
            value={ytId}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
}
