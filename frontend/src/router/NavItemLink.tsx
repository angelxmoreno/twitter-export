import React, { FC } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { NavItem } from 'reactstrap';

type Props = {
  to: string;
  label: string;
  exact?: boolean;
};
const NavItemLink: FC<Props> = ({ to, label, exact = false }) => {
  const match = useRouteMatch({
    path: to,
    exact,
  });
  const isExact = Boolean(match && match.isExact);
  return (
    <NavItem active={isExact}>
      <Link className="nav-link" to={to}>
        {label}
      </Link>
    </NavItem>
  );
};

export default NavItemLink;
