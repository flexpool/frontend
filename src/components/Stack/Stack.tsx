import React from 'react';
import styled from 'styled-components';

type Spacing = 'xs' | 'small' | 'medium' | 'large';

type StackProps = {
  vertical?: boolean;
  spacing?: Spacing;
  children: React.ReactNode;
  className?: string;
  wrap?: boolean;
};

const spacing2px = (spacing: Spacing) => {
  switch (spacing) {
    case 'xs':
      return '0.25rem';
    case 'small':
      return '0.5rem';
    case 'medium':
      return '1rem';
    case 'large':
      return '2rem';
    default:
      return '0.5rem';
  }
};

const FlexBox = styled.div<{
  vertical: boolean;
  spacing: Spacing;
  shouldWrap: boolean;
}>`
  display: flex;
  flex-direction: ${(props) => (props.vertical ? 'column' : 'row')};
  justify-content: flex-start;
  align-items: center;
  flex-wrap: ${(props) => (props.shouldWrap ? 'wrap' : 'nowrap')};

  & > * {
    flex-shrink: 0;
  }

  & > * + * {
    margin-left: ${(props) =>
      props.vertical ? '0' : spacing2px(props.spacing)};
    margin-top: ${(props) =>
      props.vertical ? spacing2px(props.spacing) : '0'};
  }
`;

const Stack = ({
  children,
  vertical = false,
  spacing = 'small',
  className,
  wrap = false,
}: StackProps) => {
  return (
    <FlexBox
      className={className}
      vertical={vertical}
      spacing={spacing}
      shouldWrap={wrap}
    >
      {children}
    </FlexBox>
  );
};

export default Stack;
