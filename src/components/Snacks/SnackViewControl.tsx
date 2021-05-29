import React from 'react';
import { useReduxState } from 'src/rdx/useReduxState';

import { Snack } from './Snack';
import styled from 'styled-components/macro';
import { useDisplaySnackOnSearchParams } from './useDisplaySnackOnSearchParams';

const Container = styled.div`
  display: block;
  position: fixed;
  z-index: 2000;
  top: 40px;
  right: 0;
`;

export const SnackViewControl = () => {
  const snackData = useReduxState('snacks');
  const snacks = Object.values(snackData);

  useDisplaySnackOnSearchParams();

  return snacks?.length ? (
    <Container>
      {snacks.map((item) => (
        <Snack key={item.id} data={item} />
      ))}
    </Container>
  ) : null;
};
//
