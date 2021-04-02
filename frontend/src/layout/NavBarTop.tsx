import React, { FC, useState } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler } from 'reactstrap';
import NavItemLink from './NavItemLink';
import AuthButton from '../components/AuthButton';

const NavBarTop: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <Navbar dark color="dark" light expand="md">
      <NavbarBrand>TwitterExport</NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItemLink to="/" exact label="Home" />
          <NavItemLink to="/search" exact label="Search" />
        </Nav>
        <AuthButton />
      </Collapse>
    </Navbar>
  );
};

export default NavBarTop;
