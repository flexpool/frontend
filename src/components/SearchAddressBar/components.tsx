import { Field, Form, Formik } from 'formik';
import styled from 'styled-components';
import { OuterEvent } from '../DivOuterEvents';

export const SearchButton = styled.button`
  cursor: pointer;
  border: 0;
  border-radius: 0px 5px 5px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--primary);
  transition: 50ms;
  height: 100%;
  width: 50px;
  transition: 0.1s all;

  svg {
    transition: 0.1s all;
    display: block;
    fill: white;
    height: 40%;
    width: 40%;
  }

  &:focus {
    svg {
      transform: scale(0.9) !important;
    }
  }
`;

export const Container = styled(OuterEvent)`
  width: 100%;
  height: 50px;
  form {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  width: 100%;
`;

export const ResultWrapper = styled.div`
  position: absolute;
  z-index: 0;
  top: 100%;
  width: 100%;
  left: 0;
  background: var(--bg-primary);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid var(--border-color);
  border-top: none;
  transition: 0.2s all;
  opacity: 0;
  visibility: hidden;

  box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.1);
  &:before {
    content: '';
    height: 3px;
    width: 3px;
    position: absolute;
    bottom: 100%;
    left: -1px;
    background: var(--bg-primary);
    border-left: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }
`;

export const FieldWrapper = styled.div<{ isOpen: boolean }>`
  height: 100%;
  position: relative;
  flex-grow: 1;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.07);
  border-radius: 5px;
  transition: 0.1s all;
  &:hover {
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.12);
  }

  ${(p) =>
    p.isOpen &&
    `
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2) !important;
    ${ResultWrapper} {
      visibility: visible;
      opacity: 1;
    }
  `}
`;

export const Input = styled(Field)`
  height: 100%;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color) !important;
  border-radius: 5px 0px 0px 5px;
  padding: 0 1rem;
  font-size: 1rem;
  outline: none;
  width: 100%;
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  display: block;
  color: var(--text-primary);
  transition: 0.1s all;
`;

export const F = styled(Form)`
  &:hover {
    ${Input} {
      background-color: var(--bg-primary);
    }
    ${SearchButton} {
      box-shadow: inset 0 0 20px 0 rgba(0, 0, 0, 0.05);
      svg {
        transform: scale(1.1);
      }
    }
    ${ResultWrapper} {
      &:before {
        background-color: var(--bg-primary);
      }
    }
  }
`;
