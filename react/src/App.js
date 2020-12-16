import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import News from './components/pages/News';

import Spotify from './Spotify';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/news' component={News} />
        <Route path='/spotify' component={Spotify} />
      </Switch>
    </Router>
  );
}

export default App;
