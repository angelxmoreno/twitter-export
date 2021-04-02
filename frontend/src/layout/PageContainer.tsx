import React, { FC } from 'react';
import NavBarTop from './NavBarTop';

const PageContainer: FC<unknown> = ({ children }) => {
  return (
    <>
      <NavBarTop />
      {children}
    </>
  );
};

export default PageContainer;
