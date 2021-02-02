require('dotenv').config();
const express = require('express');
const axios = require('axios').default;
const cheerio = require('cheerio');
const bodyParser = require('body-parser'); // parse the request and create req.body object
const cors = require('cors'); // provides Express middleware to enable CORS
const db = require('./app/models');
const socket = require('socket.io');
const Role = db.role;

const spotifyChartUrl = 'https://spotifycharts.com/regional';
const guardianUrl =
  'https://content.guardianapis.com/search?tag=music/popandrock&show-elements=image&api-key=' +
  process.env.GUARDIAN_API +
  '&show-blocks=body';
const spotifyNewReleasesUrl =
  'https://api.spotify.com/v1/browse/new-releases?market=US&Authorization=Bearer BQDxQb14-U8v-3149qwwxiXN_6Ec0I5VFavStrQID4LqqRU7WZBgPnMeUES5lSekoJFJGtE_7AbDuHDdoetp2W-xvZeTyD0z7Cnb_C1lDM8Kdhwqfk3bYSX0khzNbhaAqLlpSiZMMgc8NMC';
const billboardHot100Url = 'https://www.billboard.com/charts/hot-100';
var corsOptions = {
  origin: 'http://localhost:3000',
};
const port = process.env.PORT || 8000;
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/playlist.routes')(app);

const Song = require('./app/models/song.model');
const Playlist = require('./app/models/playlist.model');
const server = require('http').createServer(app);
server.listen(port, () => console.log('Example app listening'));

const io = socket(server);
io.on('connection', (socket) => {
  // Once a client has connected, we expect to get a ping from them saying what queue they want to join
  socket.on('joinPlaylist', function (playlist) {
    // subscribe the socket to a given channel(room)
    console.log('about to join');
    socket.join(playlist);
  });

  // When we receive a ping from a client telling to add a song, we update the database then send the data back through Sockets
  socket.on('song:add', function (playlistId, data) {
    Playlist.findOne({ _id: playlistId }, function (err, playlist) {
      if (err) {
        console.log(err);
      } else {
        if (playlist) {
          Song.create(
            {
              title: data.title,
              artist: data.artist,
              yt_id: data.yt_id,
            },
            function (err, song) {
              Playlist.updateOne(
                { _id: playlistId },
                { $push: { songs: song } },
                { upsert: true },
                function (err, data) {
                  if (err) {
                  } else {
                    // sending to all clients in the {playlistId} room, including (in) the sender
                    io.sockets.in(playlistId).emit('song:add', song);
                  }
                }
              );
            }
          );
        } else {
          console.log('the playlist does not exist');
        }
      }
    });
  });

  // When we receive a ping from a client to delete a song, we update the database and send the data back through Sockets
  socket.on('song:remove', function (playlistId, masterKey, _id) {
    Playlist.findOneAndUpdate(
      { _id: playlistId, masterKey: masterKey },
      { $pull: { songs: _id } },
      function (err, doc) {
        if (!err && doc !== null) {
          io.sockets.in(playlistId).emit('song:remove', _id);
        }
      }
    );
  });

  socket.on(
    'song:update',
    function (playlistId, masterKey, _id, title, artist, ytId) {
      Song.updateOne(
        { _id: _id },
        {
          $set: {
            title: title,
            artist: artist,
            yt_id: ytId,
          },
        },
        function (err, doc) {
          console.log(err);
        }
      );
    }
  );
});

async function main() {
  const uri =
    'mongodb+srv://' +
    process.env.MONGO_USER +
    ':' +
    process.env.MONGO_PASSWORD +
    '@cluster0.6xxnj.mongodb.net/sample_analytics?retryWrites=true&w=majority';

  db.mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('Successfully connect to MongoDB. ');
      initial();
    })
    .catch((err) => {
      console.log('Connection error', err);
      process.exit();
    });
}

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: 'moderator',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'modrator' to roles collection");
      });

      new Role({
        name: 'admin',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

main().catch(console.error);

class SpotifyData {
  constructor(image, rank, trend, track, artist, streams) {
    this.image = image;
    this.rank = rank;
    this.trend = trend;
    this.track = track;
    this.artist = artist;
    this.streams = streams;
  }
}

class BillboardData {
  constructor(rank, track, artist, lastWeek, peak, week) {
    this.rank = rank;
    this.track = track;
    this.artist = artist;
    this.lastWeek = lastWeek;
    this.peak = peak;
    this.week = week;
    // Billboard initially only loads 5 cover images, as you scroll down
    // more image urls are set in style attribute.
    // Possible solution: 1) Puuppeteer 2) Get Image from some other API
    // this.coverUrl = coverUrl;
  }
}

const Trend = Object.freeze({ new: 2, up: 1, same: 0, down: -1 });

app.get('/', (req, res) => res.send({ express: 'Hello World!' }));

function last7Days(date) {
  let result = [];
  for (let i = 0; i < 7; i++) {
    let past = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    past.setDate(past.getDate() - i);
    console.log(date.getMonth());
    result.push(past);
  }
  return result;
}

app.get('/spotify', async (req, res) => {
  let dateSuffixs = [];
  let charts = [];
  console.log(req.query);

  if (
    req.query.year !== undefined &&
    req.query.month !== undefined &&
    req.query.day !== undefined
  ) {
    // what if year month day is invalid
    if (req.query.lastWeek === '1') {
      dateSuffixs = last7Days(
        new Date(req.query.year, req.query.month - 1, req.query.day)
      ).map((date) => {
        const month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1);
        return (
          '/global/daily/' +
          date.getFullYear() +
          '-' +
          month +
          '-' +
          date.getDate()
        );
      });
      console.log(dateSuffixs);
      for (var i = 0; i < dateSuffixs.length; i++) {
        charts.push(await getSpotifySingleDay(dateSuffixs[i]));
      }
      // console.log(charts);
    } else {
      let month = req.query.month;
      if (month.length == 1) {
        month = '0' + month;
      }
      charts.push(
        await getSpotifySingleDay(
          '/global/daily/' + req.query.year + '-' + month + '-' + req.query.day
        )
      );
    }
  } else {
    let chart = await getSpotifySingleDay('');
    charts.push(chart);
  }

  res.send(charts);
});

async function getSpotifySingleDay(urlSuffix) {
  try {
    let response = await axios.get(spotifyChartUrl + urlSuffix);

    const $ = cheerio.load(response.data);
    let spotifyChart = { date: '', rankings: [] };

    spotifyChart.date = $('div[data-type=date] div').text();

    $('tr').each(function (i, elem) {
      const image = $('.chart-table-image > a > img', this).attr('src');
      const rank = $('.chart-table-position', this).text();
      let trend = $('.chart-table-trend__icon svg', this).attr('fill');
      if (trend == '#bd3200') {
        trend = Trend.down;
      } else if (trend == '#3e3e40') {
        trend = Trend.same;
      } else if (trend == '#84bd00') {
        trend = Trend.up;
      } else if (trend == '#4687d7') {
        trend = Trend.new;
      }
      const track = $('.chart-table-track > strong', this).text();
      const artist = $('.chart-table-track > span', this)
        .text()
        .replace('by ', '');
      const streams = $('.chart-table-streams', this).text();

      spotifyChart.rankings.push(
        new SpotifyData(image, rank, trend, track, artist, streams)
      );
    });
    // remove table head
    spotifyChart.rankings.shift();
    console.log(spotifyChart.rankings.length);
    return spotifyChart;
  } catch (err) {
    // console.log(err);
  }
}

app.get('/news', async (req, res) => {
  const page = req.query.page;
  axios
    .get(guardianUrl + '&page=' + page)
    .then(function (response) {
      // handle success
      res.send(response.data);
    })
    .catch(function (error) {
      // handle error: https://www.theguardian.com/info/developer-blog/2012/jul/16/http-status-codes-jsonp
      console.log(error);
    })
    .then(function () {
      // always executedd
    });
});

app.get('/billboardHot100', async (req, res) => {
  const html = await axios.get(billboardHot100Url);
  const $ = await cheerio.load(html.data);

  let hot100 = [];
  $('.chart-element__wrapper').each(function (i, elem) {
    const rank = $(
      '.chart-element__rank > .chart-element__rank__number',
      this
    ).text();
    const track = $(
      '.chart-element__information > .chart-element__information__song',
      this
    ).text();
    const artist = $(
      '.chart-element__information > .chart-element__information__artist',
      this
    ).text();

    const lastWeek = $('.chart-element__metas > .text--last', this).text();
    const peak = $('.chart-element__metas > .text--peak', this).text();
    const week = $('.chart-element__metas > .text--week', this).text();

    // const styleAttr = $('.chart-element__image', this).attr('style');
    // console.log(styleAttr);
    // var coverUrl = '';
    // var firstQuoteIdx = -1;
    // var lastQuoteIdx = -1;
    // for (var j = 0; j < styleAttr.length; j++) {
    //   if (styleAttr.charAt(j) === "'") {
    //     if (firstQuoteIdx == -1) {
    //       firstQuoteIdx = j;
    //     } else {
    //       lastQuoteIdx = j;
    //       break;
    //     }
    //   }
    // }
    // if (firstQuoteIdx != -1 && lastQuoteIdx != -1) {
    //   coverUrl = styleAttr.substring(firstQuoteIdx + 1, lastQuoteIdx);
    // }

    hot100.push(new BillboardData(rank, track, artist, lastWeek, peak, week));
  });
  res.send(hot100);
});

//server.listen(port);
