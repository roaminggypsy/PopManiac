const mongoose = require('mongoose');

const Song = mongoose.model(
  'Song',
  new mongoose.Schema({
    title: String,
    artist: String,
    yt_id: String,
  })
);

module.exports = Song;
