import styled from 'styled-components';

export const ItemWrapper = styled.a`
  min-height: 120px;
  padding: 2rem;
  width: 1px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  text-decoration: none;
  color: var(--texxt-primary);
  transition: 0.2s;

  &:hover {
    text-decoration: none;
    color: var(--primary);
  }

  @media screen and (min-width: 768px) {
    &:hover {
      text-decoration: none;
      margin: -8px;
      padding: 40px;
      z-index: 10;
      box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.2);
      background-color: var(--primary);
      --text-primary: white;
      * {
        color: var(--text-primary);
      }
    }
  }
  @media screen and (max-width: 800px) {
    padding: 1rem 1.25rem;
    &:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
    }
  }
`;

export const Category = styled.span`
  font-weight: 400;
  text-transform: uppercase;
  font-size: 12px;
  color: var(--text-secondary);
`;

export const Title = styled.span`
  margin-top: 15px;
  font-weight: 600;
  font-size: 20px;
  display: block;
`;

export const Action = styled.div`
  color: var(--primary);
  margin-top: 0.5rem;
`;

export const Wrapper = styled.div`
  position: absolute !important;
  @media screen and (max-width: 800px) {
    position: relative !important;
  }
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: center;
`;
export const WrapperInner = styled.div`
  position: absolute !important;
  top: -4rem;
  width: calc(100% - 2rem);
  display: flex;
  box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.06);
  z-index: 10;
  @media screen and (max-width: 800px) {
    position: relative !important;
    display: block;
    width: calc(100%);
    top: 2rem;
    & > * {
      width: 100%;
      display: block;
    }
  }
`;
