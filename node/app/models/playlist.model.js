const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const Playlist = mongoose.model(
  'Playlist',
  new mongoose.Schema({
    _id: {
      type: String,
      default: () => nanoid(),
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    masterKey: {
      type: String,
      default: () => nanoid(),
    },
  })
);

module.exports = Playlist;
