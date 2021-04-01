import React, { FC, useState } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler } from 'reactstrap';
import NavItemLink from './NavItemLink';

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
        <NavbarText>Simple Text</NavbarText>
      </Collapse>
    </Navbar>
  );
};

export default NavBarTop;
