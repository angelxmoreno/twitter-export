import React, { FC } from 'react';
import { Container } from 'reactstrap';
import NavBarTop from './NavBarTop';

const PageContainer: FC<unknown> = ({ children }) => {
  return (
    <>
      <NavBarTop />
      <Container fluid>{children}</Container>
    </>
  );
};

export default PageContainer;
