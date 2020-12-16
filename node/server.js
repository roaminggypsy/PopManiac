const express = require('express');
const axios = require('axios').default;
const cheerio = require('cheerio');
const spotifyChartUrl = 'https://spotifycharts.com/regional';
const guardianUrl =
  'https://content.guardianapis.com/search?tag=music/popandrock&api-key=93d5ee31-50e1-4622-926e-861010a2fddc&show-blocks=body';

const app = express();
const port = 8000;

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

const Trend = Object.freeze({ new: 2, up: 1, same: 0, down: -1 });

app.get('/', (req, res) => res.send({ express: 'Hello World!' }));

app.get('/hey', (req, res) => res.send('there'));

const fetchData = async () => {
  const result = await axios.get(spotifyChartUrl);
  return cheerio.load(result.data);
};

const getSpotifyChart = async () => {
  const $ = await fetchData();
  let rankings = [];
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

    rankings.push(new SpotifyData(image, rank, trend, track, artist, streams));
  });
  // remove table head
  rankings.shift();
  return rankings;
};

app.get('/spotify', async (req, res) => {
  const chart = await getSpotifyChart();
  res.send(chart);
});

app.get('/news', async (req, res) => {
  axios
    .get(guardianUrl)
    .then(function (response) {
      // handle success
      console.log(response.data);
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

app.listen(port, () => console.log('Example app listening'));
