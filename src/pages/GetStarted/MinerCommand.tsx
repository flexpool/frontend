import React from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components/macro';
import qs from 'query-string';
import { CopyButton } from 'src/components/CopyButton';

const HighlightItem = styled.span`
  background: var(--bg-primary);
  border-radius: 5px;
  display: inline-block;
  padding: 0.1rem 0.2rem;
`;

const CommandCodeContainer = styled.div`
  display: block;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 0 0 5px 5px;
  position: relative;
  display: flex;
  code {
    flex-grow: 1;
  }
  & > *:last-child {
    flex-shrink: 0;
  }
`;

const replaceStringsWithNodes = (
  arr: React.ReactNode[],
  replace: string,
  replaceWith: React.ReactNode
) => {
  const res: React.ReactNode[] = [];

  arr.forEach((arrItem) => {
    if (typeof arrItem === 'string') {
      const splitted = arrItem.split(replace);
      const splittedRes: React.ReactNode[] = [];
      splitted.forEach((splitItem, index) => {
        splittedRes.push(splitItem);
        if (index < splitted.length - 1) {
          splittedRes.push(replaceWith);
        }
      });

      res.push(...splittedRes);
    } else {
      res.push(arrItem);
    }
  });

  return res;
};

const replaceStringWithNodes = (
  text: string,
  items: { replace: string; replaceWith: React.ReactNode }[]
) => {
  let result: React.ReactNode[] = [text];
  items.forEach((item) => {
    result = replaceStringsWithNodes(result, item.replace, item.replaceWith);
  });

  return result;
};

export const MinerCommand: React.FC<{
  command: string;
}> = ({ command }) => {
  const { search } = useLocation();
  const {
    selectedServer = 'CLOSEST_SERVER',
    walletAddress = 'WALLET_ADDRESS',
    workerNane = 'WORKER_NAME',
  } = qs.parse(search);

  const replacedText = replaceStringWithNodes(command, [
    {
      replace: 'CLOSEST_SERVER',
      replaceWith: <HighlightItem>{`${selectedServer}`}</HighlightItem>,
    },
    {
      replace: 'WALLET_ADDRESS',
      replaceWith: <HighlightItem>{`${walletAddress}`}</HighlightItem>,
    },
    {
      replace: 'WORKER_NAME',
      replaceWith: <HighlightItem>{`${workerNane}`}</HighlightItem>,
    },
  ]);
  const copyText = replaceStringWithNodes(command, [
    {
      replace: 'CLOSEST_SERVER',
      replaceWith: `${selectedServer}`,
    },
    {
      replace: 'WALLET_ADDRESS',
      replaceWith: `${walletAddress}`,
    },
    {
      replace: 'WORKER_NAME',
      replaceWith: `${workerNane}`,
    },
  ]).join('');

  return (
    <CommandCodeContainer>
      <code>
        {replacedText.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </code>
      <CopyButton text={copyText} />
    </CommandCodeContainer>
  );
};
