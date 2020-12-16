import React, { useState, useEffect } from 'react';
import '../../App.css';
import Card from './Card';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import axios from 'axios';

export default function News() {
  const [allNews, setAllNews] = useState([]);

  useEffect(() => {
    axios
      .get('/news')
      .then(function (response) {
        // console.log(response.data.response);
        setAllNews(response.data.response.results);
        console.log(response.data.response.results.length);
      })
      .catch(function (error) {})
      .then(function () {});
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='md'>
        {allNews.map((n) => (
          <Card key={n.id} news={n} />
        ))}
      </Container>
    </React.Fragment>
  );
}
