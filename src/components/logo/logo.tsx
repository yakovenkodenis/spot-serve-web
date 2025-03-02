// Modules
import { type FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';

// Assets
import { LogoIcon } from '@/assets/logo';

// Constants
import { ROUTES } from '@/constants/routes';

export const Logo: FC = () => {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const goToHomePage = useCallback(() => {
    navigate(ROUTES.home);
  }, [navigate]);

  return (
    <LogoContainer
      onClick={goToHomePage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LogoIcon />
      {isHovered && <AnimatedText>Spot Serve</AnimatedText>}
    </LogoContainer>
  );
};

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;

  svg {
    width: 4rem;
    height: 4rem;
  }
`;

const AnimatedText = styled.span`
  font-size: 1.2rem;
  font-weight: 300;
  margin-left: 1rem;
  white-space: nowrap;
  overflow: hidden;
  position: absolute;
  left: 4rem;
  background: linear-gradient(135deg, #ff7eb3, #ff758c, #42a5f5);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (min-width: 768px) {
    animation: 
      typing 0.7s steps(10) forwards,
      gradientAnimation 5s ease infinite alternate;
  }

  @media (max-width: 767px) {
    display: none;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 2px;
    background-color: #555;
    @media (min-width: 768px) {
      animation: blink 0.8s step-end infinite;
    }
  }

  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 6.5rem;
    }
  }

  @keyframes blink {
    50% {
      background-color: transparent;
    }
  }

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
`;
