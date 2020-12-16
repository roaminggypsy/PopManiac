import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import NewReleasesIcon from '@material-ui/icons/NewReleases';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Trend = Object.freeze({
  2: <NewReleasesIcon />,
  1: <ArrowUpwardIcon />,
  0: <ArrowForwardIcon />,
  '-1': <ArrowDownwardIcon />,
});

const Spotify = (props) => {
  const classes = useStyles();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [chart, setChart] = useState([]);

  useEffect(() => {
    fetch('/spotify')
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          setIsLoaded(true);
          setChart(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
          console.log(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    //console.log(chart);
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Track</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Streams</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chart.map((row) => {
              console.log(row);
              return (
                <TableRow key={row.rank}>
                  <TableCell component='th' scope='row'>
                    {row.rank}
                  </TableCell>
                  <TableCell>{row.track}</TableCell>
                  <TableCell>{row.artist}</TableCell>
                  <TableCell>
                    {row.streams}
                    {Trend[row.trend]}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
};

export default Spotify;
