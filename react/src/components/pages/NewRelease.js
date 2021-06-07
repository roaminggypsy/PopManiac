import React from 'react';
import Container from '@material-ui/core/Container';
import Title from '../Title';

export default function NewRelease() {
  return (
    <Container maxWidth='lg'>
      <Title text='Spotify New Releases' />
      <iframe
        src='https://open.spotify.com/embed/playlist/37i9dQZF1DX4JAvHpjipBk'
        title='New Releases from Spotify'
        width='100%'
        height='400'
        frameborder='0'
        allowtransparency='true'
        allow='encrypted-media'
      ></iframe>
      <Title text='Apple Music New Releases' />
      <iframe
        allow='autoplay *; encrypted-media *; fullscreen *'
        title='New Releases from Apple Musics'
        frameborder='0'
        height='400'
        style={{
          width: '100%',
          overflow: 'hidden',
          background: 'transparent',
        }}
        sandbox='allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation'
        src='https://embed.music.apple.com/us/playlist/new-music-daily/pl.2b0e6e332fdf4b7a91164da3162127b5'
      ></iframe>
      <Title text='Youtube Vevo New Releases' />
      <iframe
        title='New Releases from Youtube Vevo'
        width='100%'
        height='600px'
        src='https://www.youtube.com/embed/videoseries?list=PL9tY0BWXOZFtwzdsm2-EL-4tiR0EqRPz1'
        frameborder='0'
        allow='autoplay; encrypted-media'
        allowfullscreen
      ></iframe>
    </Container>
  );
}
