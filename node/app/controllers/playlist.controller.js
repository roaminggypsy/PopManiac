const db = require('../models');
const Song = require('../models/song.model');
const Playlist = db.playlist;
/**
 * create a PlayList
 */
exports.createPlaylist = (req, res) => {
  const playlist = new Playlist({
    songs: [],
  });

  playlist.save((err, playlist) => {
    if (err) {
      res.status(500).send({ error: err });
      return;
    }

    res.status(200).send({
      message: 'A new playlist is successfully created!',
      playlist: playlist,
    });
  });
};

exports.isMaster = (req, res) => {
  Playlist.findOne({ _id: req.params.id }).exec(function (err, playlist) {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      if (playlist) {
        if (playlist.masterKey === req.params.key) {
          res.status(200).send({
            isMaster: true,
            message: 'Valid master key',
          });
        } else {
          res.status(200).send({
            isMaster: false,
            message: 'Invalid master key',
          });
        }
      } else {
        res.status(200).send({
          notExist: true,
          message: 'No Playlist exists with the given ID',
        });
      }
    }
  });
};

exports.getPlaylistUpdate = (req, res) => {
  Playlist.findOne({ _id: req.params.id })
    .populate('songs') // Without populate, it's just _id
    .exec(function (err, playlist) {
      if (err) {
        res.status(200).send({ error: err });
      } else {
        if (playlist) {
          res.json(playlist);
        } else {
          res.status(200).send({
            notExist: true,
            message: 'No playlist exists with the given ID',
          });
        }
      }
    });
};

exports.addSong = (req, res) => {
  Playlist.countDocuments({ _id: req.params.id }, function (err, count) {
    if (err) {
      console.log('there');
      res.status(500).send({ error: err });
    } else {
      if (count > 0) {
        Song.create(
          {
            title: req.body.title,
            artist: req.body.artist,
            yt_id: req.body.yt_id,
          },
          function (err, song) {
            // error handling
            Playlist.updateOne(
              { _id: req.params.id },
              { $push: { songs: song } },
              { upsert: true },
              function (err, data) {
                if (err) {
                  console.log('here');
                  res.json({ error: err });
                } else {
                  console.log('what');
                  res.json({ message: 'Successfully inserted one song' });
                }
              }
            );
          }
        );
      } else {
        res.status(200).send({
          notExist: true,
          message: 'No playlist exists with the given ID',
        });
      }
    }
  });
};
