// Modules
import { type FC } from 'react';
import { Outlet } from 'react-router';
import styled from '@emotion/styled';

// Components
import { Header } from '@/components/header';

// Config
import { GlobalStyles } from '@/config/global-styles';

// Context
import { PeerRpcContextProvider } from '@/context/peer-rpc';

export const App: FC = () => {
  return (
    <PeerRpcContextProvider options={{ debug: import.meta.env.MODE === 'development' }}>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <Outlet />
      </AppContainer>
    </PeerRpcContextProvider>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(120deg, #fdfbfb, #ebedee);
  position: relative;
`;
