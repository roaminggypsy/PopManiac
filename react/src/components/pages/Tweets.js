import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  margin: auto;
  max-width: 550px;
  width: 100%;
`;

export default function Tweets() {
  const options = { height: '600px' };

  return (
    <StyledContainer maxWidth='md'>
      <TwitterTimelineEmbed
        theme='dark'
        sourceType='profile'
        screenName='chartdata'
        options={options}
      />
      <TwitterTimelineEmbed
        theme='dark'
        sourceType='profile'
        screenName='PopCrave'
        options={options}
      />
    </StyledContainer>
  );
}
