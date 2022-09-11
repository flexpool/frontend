import React from 'react';
import styled from 'styled-components';
import { CopyButton } from 'src/components/CopyButton';
import { FormikValues } from 'formik';

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

// TODO: need to add this back
const replaceHKEPorts = (regionURL: string, varname: string, s: string) => {
  if (regionURL == 'sgeetc.gfwroute.co') {
    return s.replaceAll(`${varname}:5555`, `${varname}:58607`);
  }
  return s;
};

export const MinerCommand = <Value extends FormikValues = FormikValues>({
  command,
  replaces,
}: {
  command: string;
  replaces: Record<string, string>;
}) => {
  const replacedItems = Object.keys(replaces).map((replace) => {
    return {
      replace,
      replaceWith: replaces[replace],
    };
  });

  const replacedText = replaceStringWithNodes(command, replacedItems);

  const copyText = replacedText.join('');

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

export default MinerCommand;
