const controller = require('../controllers/playlist.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post('/api/playlist/create', controller.createPlaylist);

  app.get('/api/playlist/:id/master/:key', controller.isMaster);

  app.get('/api/playlist/:id', controller.getPlaylistUpdate);

  app.post('/api/playlist/:id/add', controller.addSong);
};
