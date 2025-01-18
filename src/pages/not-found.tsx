// Modules
import { type FC, useCallback } from 'react';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';

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
      <RedirectButton onClick={handleRedirect}>Go to Main Page</RedirectButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  text-align: center;
  background: linear-gradient(120deg, #fdfbfb, #ebedee);
  padding: 2rem;
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
  text-rendering: geometricPrecision; /* Ensures precise text rendering */
  -webkit-font-smoothing: antialiased; /* Improves font clarity on webkit browsers */
  -moz-osx-font-smoothing: grayscale; /* Improves font clarity on macOS */
  overflow-wrap: normal; /* Prevents text wrapping issues */
  white-space: nowrap; /* Ensures text isn't wrapped or squeezed */
  
  span {
    display: block;
    font-size: 8rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.1;
    text-rendering: geometricPrecision; /* Consistent rendering for nested span */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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

const Description = styled.p`
  font-size: 1.25rem;
  font-weight: 300;
  color: #555;
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const RedirectButton = styled.button`
  font-size: 1.25rem;
  padding: 1rem 2.5rem;
  color: #ffffff;
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  border-radius: 3rem;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;
