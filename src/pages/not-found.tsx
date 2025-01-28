// Modules
import { type FC, useCallback } from 'react';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';

// Components
import { Button } from '@/components/button';

export const Component: FC = () => {
  const navigate = useNavigate();

  const handleRedirect = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Container>
      <Heading>
        <span>404</span> Page Not Found
      </Heading>
      <Description>
        The page you are looking for does not exist or has been moved. Please return to the main page.
      </Description>
      <Button onClick={handleRedirect}>Go to Main Page</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-align: center;
  background: linear-gradient(120deg, #fdfbfb, #ebedee);
  padding: 2rem;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Heading = styled.h1`
  font-size: 6rem;
  font-weight: 300;
  margin: 2rem 0 3rem;
  padding: 0.5rem 0;
  line-height: 1.2;
  letter-spacing: normal;
  color: #222;
  background: linear-gradient(135deg, #ff7eb3, #ff758c, #42a5f5);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 300%;
  animation: gradientAnimation 5s ease infinite alternate;
  display: block;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-wrap: normal;
  white-space: nowrap;
  
  span {
    display: block;
    font-size: 8rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.1;
    text-rendering: geometricPrecision;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    @media (max-width: 768px) {
      font-size: 5rem;
    }

    @media (max-width: 480px) {
      font-size: 4rem;
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

  @media (max-width: 768px) {
    font-size: 3rem;
    white-space: normal;
    margin: 1.5rem 0;
  }

  @media (max-width: 480px) {
    font-size: 2.25rem;
    margin: 1rem 0 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  font-weight: 300;
  color: #555;
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0;
    margin-bottom: 1.5rem;
  }
`;
