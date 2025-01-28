// Modules
import { type FC, useState, useCallback } from 'react';
import { NavLink } from 'react-router';
import styled from '@emotion/styled';
import { type HTMLMotionProps, motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx'

// Components
import { Logo } from '@/components/logo';

// Constants
import { ROUTES } from '@/constants/routes';

const mobileNavListProps = {
  initial: { opacity: 0, x: '-100%' },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '-100%' },
  transition: { type: 'spring', stiffness: 200, damping: 20 },
} as const satisfies HTMLMotionProps<'nav'>;

type Props = {
  toggleMenu?: () => void;
};

const Navigation: FC<Props> = ({ toggleMenu }) => (
  <>
    <NavLink onClick={toggleMenu} to={ROUTES.home} end>
      Home
    </NavLink>
    <NavLink onClick={toggleMenu} to={ROUTES.about} end>
      About
    </NavLink>
    <NavLink onClick={toggleMenu} to={ROUTES.support} end>
      Support
    </NavLink>
    <NavLink onClick={toggleMenu} to={ROUTES.app} end>
      App
    </NavLink>
  </>
);

export const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  return (
    <TransparentHeader>
      <Logo />
      <HamburgerButton onClick={toggleMenu} className={clsx({ open: menuOpen })}>
        <span />
        <span />
        <span />
      </HamburgerButton>
      <AnimatePresence>
        {menuOpen && (
          <MobileNav {...mobileNavListProps}>
            <Navigation toggleMenu={toggleMenu} />
          </MobileNav>
        )}
      </AnimatePresence>
      <NavList>
        <Navigation />
      </NavList>
    </TransparentHeader>
  );
};

const TransparentHeader = styled.div`
  position: sticky;
  top: 0;
  right: 0;
  margin: 0;
  padding: 1rem 2rem;
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

  @media (max-width: 600px) {
    display: none;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1100;
  position: relative;
  width: 30px;
  height: 24px;

  span {
    display: block;
    width: 100%;
    height: 3px;
    background: #555;
    position: absolute;
    left: 0;
    transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  span:nth-of-type(1) {
    top: 0;
  }

  span:nth-of-type(2) {
    top: 10px;
  }

  span:nth-of-type(3) {
    top: 20px;
  }

  &.open span:nth-of-type(1) {
    transform: translateY(10px) rotate(45deg);
  }

  &.open span:nth-of-type(2) {
    opacity: 0;
  }

  &.open span:nth-of-type(3) {
    transform: translateY(-10px) rotate(-45deg);
  }

  @media (max-width: 600px) {
    display: block;
  }
`;

const MobileNav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  z-index: 1000;

  a {
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    text-decoration: none;

    &:hover,
    &.active {
      color: #222;
    }
  }
`;
