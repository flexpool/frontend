import { CopyButton } from 'src/components/CopyButton';
import styled from 'styled-components';

const TerminalContainer = styled.code`
  display: flex;
  justify-content: space-between;
  padding: 1.25rem;
  background: var(--bg-secondary);
  white-space: pre-line;
`;

const Commands = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px;
`;

const Command = styled.code`
  ::before {
    content: '$ ';
    color: var(--text-tertiary);
  }
`;

const CommandSecondary = styled.code`
  color: var(--text-tertiary);
`;

const CommandResultContainer = styled(TerminalContainer)`
  display: block;
  color: var(--text-secondary);
  background: var(--bg-primary);
  border: 5px solid var(--bg-secondary);
  overflow-x: auto;
`;

type TerminalCommandProps = {
  cmd: React.ReactNode;
  output?: React.ReactNode;
};

export const TerminalCommand = (props: TerminalCommandProps) => {
  const { cmd, output } = props;
  return (
    <div>
      <TerminalContainer>
        <Commands>
          {(cmd as string).split('\n').map((item) => {
            var commandItems: Array<React.ReactNode> = [];
            item.split(' ').forEach((itemCommand) => {
              if (
                itemCommand.length > 0 &&
                itemCommand.substr(0, 1) === '<' &&
                itemCommand.substr(itemCommand.length - 1, itemCommand.length) === '>'
              ) {
                commandItems.push(<CommandSecondary>{itemCommand} </CommandSecondary>);
              } else {
                commandItems.push(itemCommand + ' ');
              }
            });
            return <Command key={item}>{commandItems}</Command>;
          })}
        </Commands>
        <CopyButton text={cmd as string} />
      </TerminalContainer>
      {output !== undefined ? (
        <CommandResultContainer>{output}</CommandResultContainer>
      ) : null}
    </div>
  );
};
