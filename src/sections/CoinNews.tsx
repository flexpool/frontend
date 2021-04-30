import React from 'react';
import { Img } from 'src/components/Img';
import { LinkOut } from 'src/components/LinkOut';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
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

const ArticleWrapper = styled(LinkOut)`
  padding: 1rem 1.25rem;
  display: block;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  transition: 0.2s all;
  & + * {
    margin-top: 0.5rem;
  }
  position: relative;
  /* &:before {
    content: 'Read more';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-secondary);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: 0.2s all;
  } */
  &:hover {
    /* background: var(--bg-secondary); */
    text-decoration: none;
    border-color: var(--primary);
    h3 {
      color: var(--primary);
    }
    /* & > * {
      filter: blur(10px);
    } */
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
const SourceImage = styled(Img)`
  height: 1.25rem;
  margin-right: 0.5rem;
`;
const ArticleImage = styled(Img)`
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
  const dateFormatter = useLocalizedDateFormatter();
  return (
    <ArticleWrapper href={data.link}>
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
            {dateFormatter.distanceFromNow(data.timestamp * 1000)}
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
    // eslint-disable-next-line
  }, [coinTicker]);

  return (
    <>
      {(newsState.data || []).map((item) => (
        <CoinNewsItem data={item} key={item.link} />
      ))}
    </>
  );
};
