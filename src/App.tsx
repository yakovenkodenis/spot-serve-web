// Modules
import { type FC, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

// Config
import { API_BASE_URL } from '@/config';
import { GlobalStyles } from '@/global-styles';

// Context
import { usePeerRpcContext } from '@/context/peer-rpc-context';

// Services
import { loadWebsiteZip } from '@/services/load-website';
import { handlerFactories } from '@/services/peer-rpc';

const url = `${API_BASE_URL}/zip`;

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const peerRpc = usePeerRpcContext();

  useEffect(() => {
    if (!peerRpc) return;
      peerRpc.registerHandler('connect', handlerFactories.createConnectionHandler(async (data) => {
        console.log('Connect response:', { data });
      }));

      peerRpc.request<object>('website-zip-archive').then((response) => {
        console.log({ response });
      });
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const indexHtml = await loadWebsiteZip(url);
      document.open();
      document.write(indexHtml);
      document.close();
    } catch (error) {
      console.error('Error loading website:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <HeaderText>
          <span>Spot Serve</span>
          please press the button below to load a website preview
        </HeaderText>
        <Button onClick={handleClick} disabled={isLoading} isLoading={isLoading}>
          Load preview
        </Button>
      </AppContainer>
    </>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(120deg, #fdfbfb, #ebedee);
`;

const HeaderText = styled.h1`
  font-size: 3rem;
  font-weight: 300;
  color: #222;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
  background: linear-gradient(135deg, #ff7eb3, #ff758c, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 300%;
  animation: gradientAnimation 5s ease infinite alternate;

  span {
    display: block;
    font-size: 5rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
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

// const Input = styled.input`
//   width: 80%;
//   max-width: 400px;
//   font-size: 1.25rem;
//   padding: 0.75rem 1.25rem;
//   margin-bottom: 1.5rem;
//   border: none;
//   border-radius: 2rem;
//   outline: none;
//   color: #333;
//   background: #fff;
//   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//   transition: box-shadow 0.3s ease, transform 0.3s ease;

//   &::placeholder {
//     color: #aaa;
//     font-weight: 300;
//   }

//   &:focus {
//     box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
//     transform: scale(1.02);
//   }
// `;


type ButtonProps = {
  isLoading: boolean;
};

const Button = styled.button<ButtonProps>`
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

  &:disabled {
    background: linear-gradient(135deg, #ddd, #bbb);
    cursor: not-allowed;
  }

  ${(props) =>
    props.isLoading &&
    css`
      color: transparent;
      pointer-events: none;
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1.5rem;
        height: 1.5rem;
        border: 3px solid transparent;
        border-top: 3px solid #ffffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    `}

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export default App;
