import React, { useState, useEffect } from 'react';
import '../../App.css';
import Card from './Card';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';

const remoteRowCount = 40;

export default function News() {
  const [allNews, setAllNews] = useState([]);

  function isRowLoaded({ index }) {
    return !!allNews[index];
  }

  function loadMoreRows({ startIndex, stopIndex }) {
    axios
      .get('/news?page=' + (allNews.length / 10 + 1))
      .then(function (response) {
        // console.log(response.data.response);
        setAllNews([...allNews, ...response.data.response.results]);
      })
      .catch(function (error) {})
      .then(function () {});
  }

  function rowRenderer({ key, index, style }) {
    console.log(allNews[index]);
    return (
      <div key={key} style={style}>
        {allNews[index] === undefined ? (
          <Card loading={true} />
        ) : (
          <Card news={allNews[index]} />
        )}
      </div>
    );
  }

  return (
    <div style={{ height: '80vh' }}>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={remoteRowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={remoteRowCount}
                rowHeight={150}
                rowRenderer={rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  );
}
