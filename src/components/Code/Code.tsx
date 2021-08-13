import React from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from './theme';
import { CopyButton } from '../CopyButton';

const Pre = styled.pre`
  text-align: left;
  overflow: auto;
  padding: 20px !important;
  position: relative;
  margin: 0px !important;
`;

const CopyButtonWrapper = styled.div`
  padding: 20px;
  position: absolute;
  top: 0;
  right: 0;
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
    <Highlight {...defaultProps} theme={theme} code={children} language={language}>
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
