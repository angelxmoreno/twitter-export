import React, { FC } from 'react';
import { Container } from 'reactstrap';
import AuthButton from '../components/AuthButton';

const LogIn: FC = () => {
  return (
    <Container>
      <h1 className="pt-3">LogIn</h1>
      <p>In order to access this page you first need to sign in.</p>
      <AuthButton />
    </Container>
  );
};

export default LogIn;
