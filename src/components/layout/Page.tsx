import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './Page.scss';

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CSSTransition in={true} timeout={0} appear unmountOnExit>
      <div className="page-transition">{children}</div>
    </CSSTransition>
  );
};
