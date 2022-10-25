import React from 'react';
import styled from 'styled-components';

type DetailItem = {
  key: string;
  value: string;
};

type PoolDetailsProps = {
  items: DetailItem[];
};

const DetailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Item = styled.div`
  flex-basis: 50%;
  padding: 14px 6px 8px 0;
`;

const ItemHeading = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.7;
  white-space: nowrap;
`;

const ItemDescription = styled.div`
  margin-top: 4px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
`;

const PoolDetailsWrapper = styled.div`
  padding: 42px 48px 68px;
  border-top: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 24px 26px 30px;
  }
`;

export const PoolDetails = ({ items }: PoolDetailsProps) => {
  return (
    <PoolDetailsWrapper>
      <h2>Pool Details</h2>
      <DetailContainer>
        {items.map((item, index) => {
          return (
            <Item key={index}>
              <ItemHeading>{item.key}</ItemHeading>
              <ItemDescription>{item.value}</ItemDescription>
            </Item>
          );
        })}
      </DetailContainer>
    </PoolDetailsWrapper>
  );
};

export default PoolDetails;
