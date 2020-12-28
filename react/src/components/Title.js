import React from 'react';
import styled from 'styled-components';

const StyledH1 = styled.h1`
  padding: 16px 0 16px 0;

  &:hover {
    color: rgb(94, 230, 196);
  }
`;

export default function Title(props) {
  return <StyledH1>{props.text}</StyledH1>;
}
