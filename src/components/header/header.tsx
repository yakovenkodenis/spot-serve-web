// Modules
import { type FC } from 'react';
import { NavLink } from 'react-router';
import styled from '@emotion/styled';

// Components
import { Logo } from '@/components/logo';

// Constants
import { ROUTES } from '@/constants/routes';

export const Header: FC = () => {
  return (
    <TransparentHeader>
      <Logo />
      <NavList>
        <NavLink to={ROUTES.home} end>
          Home
        </NavLink>
        <NavLink to={ROUTES.about} end>
          About
        </NavLink>
        <NavLink to={ROUTES.support} end>
          Support
        </NavLink>
        <NavLink to={ROUTES.app} end>
          App
        </NavLink>
      </NavList>
    </TransparentHeader>
  );
};

const TransparentHeader = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  z-index: 1000;
`;

const NavList = styled.nav`
  display: flex;
  gap: 3.5rem;
  margin: 0;
  padding: 0;
  font-size: 1rem;
  font-weight: 300;

  a {
    color: #555;
    cursor: pointer;
    transition: color 0.3s ease;
    text-decoration: none;

    &:hover,
    &.active {
      color: #222;
    }
  }
`;
