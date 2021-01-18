import React, { useState, useEffect, useMemo } from 'react';

import Table from './components/Table';
import Container from '@material-ui/core/Container';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import NewReleasesIcon from '@material-ui/icons/NewReleases';

import DatePicker from './components/DatePicker';

import { ResponsiveLine } from '@nivo/line';

const axios = require('axios');

const Trend = Object.freeze({
  2: <NewReleasesIcon />,
  1: <ArrowUpwardIcon />,
  0: <ArrowForwardIcon />,
  '-1': <ArrowDownwardIcon />,
});

const Spotify = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [chart, setChart] = useState([]);
  const [latestDate, setLatestDate] = useState(new Date());
  const [lineChartData, setLineChartData] = useState([]);

  function last7Days(date) {
    let result = [];
    console.log(date);
    for (let i = 0; i < 7; i++) {
      let past = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      past.setDate(past.getDate() - i);
      result.push(past);
    }
    return result;
  }

  function coverCell({ row }) {
    return <img src={row.original.image} />;
  }

  function streamCell({ row }) {
    return (
      <div>
        {row.original.streams} {Trend[row.original.trend]}
      </div>
    );
  }

  function onDateChange(date) {
    console.log(date);
    setIsLoaded(false);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    axios
      .get('/spotify?year=' + year + '&month=' + month + '&day=' + day)
      .then(function (response) {
        setChart(response.data[0]);
        setLatestDate(response.data.date);
        setIsLoaded(true);
      })
      .catch(function (error) {})
      .then(function () {});
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'rank',
        disableSortBy: true,
      },
      {
        Header: 'Cover',
        accessor: 'image',
        Cell: coverCell,
        disableSortBy: true,
      },
      {
        Header: 'Track',
        accessor: 'track',
        disableSortBy: true,
      },
      {
        Header: 'Artist',
        accessor: 'artist',
        disableSortBy: true,
      },
      {
        Header: 'Streams',
        accessor: 'streams',
        Cell: streamCell,
        disableSortBy: true,
      },
    ],
    []
  );

  const chartData = useMemo(() => {
    if (chart === undefined || chart.length === 0) {
      return [];
    } else {
      return chart.rankings;
    }
  }, [chart]);

  useEffect(() => {
    fetch('/spotify')
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          console.log(result);
          setChart(result[0]);
          console.log(chart);
          console.log(result[0].date);
          const dateData = result[0].date
            .split('/')
            .map((str) => parseInt(str));
          setLatestDate(new Date(dateData[2], dateData[0] - 1, dateData[1]));
          setIsLoaded(true); // if put before setLatestDate, the latestDate would still be date()
          console.log(new Date(dateData[2], dateData[0] - 1, dateData[1]));
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    if (isLoaded) {
      axios
        .get(
          '/spotify?year=' +
            latestDate.getFullYear() +
            '&month=' +
            (latestDate.getMonth() + 1) +
            '&day=' +
            latestDate.getDate() +
            '&lastWeek=1'
        )
        .then(function (response) {
          const resData = response.data;
          let lineData = [];
          for (let dateIdx = 6; dateIdx > 0; dateIdx--) {
            const date = resData[dateIdx].date;
            const dateChart = resData[dateIdx].rankings;
            for (let pos = 0; pos < 10; pos++) {
              let found = false;
              for (let i = 0; i < lineData.length; i++) {
                if (lineData[i].id === dateChart[pos].track) {
                  lineData[i].data.push({
                    x: date,
                    y: dateChart[pos].streams.replaceAll(',', ''),
                  });
                  found = true;
                  break;
                }
              }
              if (!found) {
                lineData.push({
                  id: dateChart[pos].track,
                  data: [
                    { x: date, y: dateChart[pos].streams.replaceAll(',', '') },
                  ],
                });
              }
            }
          }
          // for (let i = 0; i < lineData.length; i++) {
          //   console.log(lineData[i].id);
          // }
          setLineChartData(lineData);
          console.log(lineData);
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {});
    }
  }, [isLoaded]);

  const MyResponsiveLine = ({ data /* see data tab */ }) => (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 120, bottom: 50, left: 120 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      yFormat='>-,.2r'
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      colors={{ scheme: 'paired' }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      enableSlices='x'
      sliceTooltip={({ slice }) => {
        return (
          <div
            style={{
              background: 'white',
              padding: '9px 12px',
              border: '1px solid #ccc',
            }}
          >
            <div>Date: {slice.points[0].data.x}</div>
            {slice.points.map((point) => (
              <div
                key={point.id}
                style={{
                  color: point.serieColor,
                  padding: '3px 0',
                }}
              >
                <strong>{point.serieId}</strong> [{point.data.yFormatted}]
              </div>
            ))}
          </div>
        );
      }}
      legends={[
        {
          anchor: 'top-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'right-to-left',
          itemWidth: 0,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container>
        <DatePicker
          date={chart.date}
          minDate={new Date(2017, 0, 1)}
          onDateChange={onDateChange}
        />
        <Table columns={columns} data={chartData} />
        <div style={{ height: '500px' }}>
          {isLoaded && <MyResponsiveLine data={lineChartData} />}
        </div>
      </Container>
    );
  }
};

export default Spotify;
