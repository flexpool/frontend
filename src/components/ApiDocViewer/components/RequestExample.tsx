import React from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import { CopyButton } from '@/components/CopyButton';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import theme from '@/components/Code/theme';
import { reduce } from 'lodash';

const StyledTab = styled(Tab)`
  all: unset;
  color: var(--text-primary);
  opacity: 0.5;

  cursor: pointer;
  padding: 6px 6px 10px;

  font-weight: 500;
  font-size: 14px;

  &:hover {
    opacity: 1;
  }

  &[aria-selected='true'] {
    border-bottom: 1px solid var(--text-primary);
    opacity: 1;
  }

  transition: all 0.1s linear;
`;

const StyledTabList = styled(TabList)`
  list-style: none;
  list-style-type: none;
  height: 100%;
  padding: 11px;

  background: var(--bg-primary);
  border-radius: 5px;

  ${StyledTab} + ${StyledTab} {
    margin-left: 8px;
  }
`;

const Pre = styled.pre`
  text-align: left;
  overflow: auto;
  padding: 20px !important;
  margin: 0px !important;
`;

const CopyButtonWrapper = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
`;

const Line = styled.div`
  display: table-row;
  line-height: 1.4em;
`;

const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  color: var(--text-tertiary);
`;

const LineContent = styled.span`
  display: table-cell;
`;

export const Code: React.FC<{
  language: Language;
  children: string;
}> = ({ language, children }) => {
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <Line key={i} {...getLineProps({ line, key: i })}>
              <LineNo>{i + 1}</LineNo>
              <LineContent>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </LineContent>
            </Line>
          ))}
          <CopyButtonWrapper>
            <CopyButton text={children as string} />
          </CopyButtonWrapper>
        </Pre>
      )}
    </Highlight>
  );
};

const Container = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-secondary);

  .token.value,
  .token.url {
    color: var(--code-string);
  }

  .token.option,
  .token.plain {
    color: var(--code-key);
  }
`;

type Endpoint = {
  method: 'GET' | 'POST';
  path: string;
  params: any;
};

const generateCURL = (endpoint: Endpoint) => {
  const params =
    endpoint.params &&
    reduce(
      endpoint.params,
      (result, value, key) => {
        result[key] = `<${value}>`;
        return result;
      },
      {}
    );

  const query =
    params && endpoint.method === 'GET'
      ? `?${decodeURIComponent(new URLSearchParams(params).toString())}`
      : '';

  const method = `-X ${endpoint.method} "https://api.flexpool.io/v2${endpoint.path}${query}" `;

  const data =
    params && endpoint.method !== 'GET'
      ? `-d '${JSON.stringify(params)}' \\\n`
      : '';
  const header =
    endpoint.method !== 'GET' ? `\\\n-H "Content-Type: application/json"` : '';

  return `curl ${data}${method}${header}`;
};

export const RequestExample = ({ endpoint }: { endpoint: Endpoint }) => {
  return (
    <Container>
      <Tabs>
        <StyledTabList>
          <StyledTab>cURL</StyledTab>
        </StyledTabList>

        <TabPanel>
          <Code language="bash">{generateCURL(endpoint)}</Code>
        </TabPanel>
      </Tabs>
    </Container>
  );
};
