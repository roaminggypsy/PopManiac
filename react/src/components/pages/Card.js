import { Divider } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid #dadce0;
  border-radius: 9px;
  padding: 16px;
  position: relative;
  min-height: 132px;
`;

const Img = styled.img`
  position: absolute;
  top: 16px;
  right: 16px;
  bottom: auto;
  left: auto;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
`;

const Text = styled.div`
  padding-right: 140px;
`;

export default function Card(props) {
  const news = props.news;

  console.log(news);
  return (
    <Container>
      <Img src='img1.png' />
      {news && (
        <Text>
          <div>{news['webTitle']}</div>
          <div>{news.blocks.body[0].bodyTextSummary.substring(0, 300)}</div>
        </Text>
      )}
    </Container>
  );
}
