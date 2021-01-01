import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import News from './components/pages/News';
import Tweets from './components/pages/Tweets';
import NewRelease from './components/pages/NewRelease';
import Billboard from './components/pages/Billboard';
import Spotify from './Spotify';
import Playlists from './components/Playlists';
import JoinPlayList from './components/JoinPlaylist';
import Playlist from './components/Playlist';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={NewRelease} />
        <Route path='/news' component={News} />
        <Route path='/spotify' component={Spotify} />
        <Route path='/billboard' component={Billboard} />
        <Route path='/tweets' component={Tweets} />

        <Route path='/playlists' exact component={Playlists} />
        <Route path='/playlists/join' component={JoinPlayList} />
        <Route path='/playlists/:id' component={Playlist} />
        <Route
          path='/playlists/:id/master'
          component={Playlist}
          master={true}
        />
      </Switch>
    </Router>
  );
}

export default App;
