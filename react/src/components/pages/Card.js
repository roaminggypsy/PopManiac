import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  border: 1px solid rgb(95, 99, 104);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  min-height: 132px;
  margin: 32px 0 32px 0;

  &:hover {
    background-color: rgb(95, 99, 104);
  }
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

const Title = styled.h3`
  font-family: Roboto, RobotoDeaft, Helvettica, Arial, sans-serif;
  font-size: 18px;
  font-weight: 700;
`;

const Summary = styled.div`
  opacity: 0.7;
  overflow-wrap: break-word;
  font-size: 14px;
`;

export default function Card(props) {
  const news = props.news;
  console.log(news);

  const elements = props.news && props.news.blocks.body[0].elements;
  var imgUrl = '';

  if (elements !== undefined) {
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].type === 'image') {
        imgUrl = elements[i].assets[0].file;
        console.log(imgUrl);
        break;
      }
    }
  }

  if (imgUrl === '') {
    imgUrl = 'https://assets.guim.co.uk/images/apps/app-logo.png';
  }

  function onClick() {
    if (news !== undefined) {
      window.open(news.webUrl, '_blank');
    }
  }

  return (
    <CardWrapper onClick={onClick}>
      <Img src={imgUrl} />
      {news !== undefined ? (
        <Text>
          <Title>{news['webTitle']}</Title>
          <Summary>
            {news.blocks.body[0].bodyTextSummary.substring(0, 400)}...
          </Summary>
        </Text>
      ) : (
        <Text>
          <Title>Loading</Title>
          <Summary>Loading...</Summary>
        </Text>
      )}
    </CardWrapper>
  );
}
