import React from 'react';
import { Card } from 'src/components/layout/Card';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { dateUtils } from 'src/utils/date.utils';
import { fetchApi } from 'src/utils/fetchApi';
import { stringUtils } from 'src/utils/string.utils';
import styled from 'styled-components';

type ApiCoinNewsArticle = {
  description: string;
  favicon: string;
  image: string;
  link: string;
  source: string;
  timestamp: number;
  title: string;
};

const ArticleWrapper = styled(Card)`
  & + * {
    margin-top: 0.5rem;
  }
`;
const ArticleSplit = styled.div`
  display: flex;
`;
const ArticleFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;
const SourceImage = styled.img`
  height: 1.25rem;
  margin-right: 0.5rem;
`;
const ArticleImage = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const ArticleImageContainer = styled.div`
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  height: 100px;
  width: 100px;
  overflow: hidden;
  border-radius: 5px;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const CoinNewsItem: React.FC<{ data: ApiCoinNewsArticle }> = ({ data }) => {
  return (
    <ArticleWrapper padding>
      <ArticleSplit>
        <ArticleImageContainer>
          <ArticleImage
            src={data.image}
            alt={data.title + ' - ' + data.source}
          />
        </ArticleImageContainer>
        <div>
          <h3>{data.title}</h3>
          <p>{stringUtils.trim(data.description, 500)}</p>
          <ArticleFooter>
            <SourceImage
              className="source-favicon"
              src={data.favicon}
              alt={data.source + ' Icon'}
            />
            {data.source}
            {' — '}
            {dateUtils.formatDistance(data.timestamp * 1000)}
          </ArticleFooter>
        </div>
      </ArticleSplit>
    </ArticleWrapper>
  );
};

export const CoinNews: React.FC<{ coinTicker: string }> = ({ coinTicker }) => {
  const newsState = useAsyncState<ApiCoinNewsArticle[]>();

  React.useEffect(() => {
    newsState.start(
      fetchApi('https://coin-news-api.flexpool.io/news', {
        query: {
          coin: coinTicker,
        },
      })
    );
  }, [coinTicker]);

  return (
    <>
      {(newsState.data || []).map((item) => (
        <CoinNewsItem data={item} key={item.link} />
      ))}
    </>
  );
};
