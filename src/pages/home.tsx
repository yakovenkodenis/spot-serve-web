// Updated Home Component
import { type FC, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { usePeerRpc } from '@/context/peer-rpc';
import { useQueryParam } from '@/hooks/use-query-param';
import { loadWebsiteZipFromBlob } from '@/services/load-website';

export const Component: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { rpc, rpcMethods } = usePeerRpc();

  const remotePeerId = useQueryParam('r');

  const handleClick = useCallback(async () => {
    if (!rpc) return;

    setIsLoading(true);
    try {
      const response = await rpc.request<Uint8Array>(rpcMethods.websiteZipArchive);
      const indexHtml = await loadWebsiteZipFromBlob(new Blob([response]));

      document.open();
      document.write(indexHtml);
      document.close();
    } catch (error) {
      console.error('Error loading website:', error);
    } finally {
      setIsLoading(false);
    }
  }, [rpc, rpcMethods.websiteZipArchive]);

  const buttonDisabled = isLoading || !remotePeerId || !rpc;

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderText>
          <span>Spot Serve</span>
        </HeaderText>
        <SubHeader>
          {remotePeerId
            ? 'Easily share and preview websites instantly!'
            : 'Please ensure the URL contains the website ID.'}
        </SubHeader>

        <Features>
          <FeatureCard>
            <Icon>🌐</Icon>
            <h3>Preview Websites</h3>
            <p>Quickly load and preview websites with ease.</p>
          </FeatureCard>
          <FeatureCard>
            <Icon>🔗</Icon>
            <h3>Shareable Links</h3>
            <p>Generate unique links to share previews securely.</p>
          </FeatureCard>
          <FeatureCard>
            <Icon>⚡</Icon>
            <h3>Fast and Secure</h3>
            <p>Powered by WebRTC for efficient collaboration.</p>
          </FeatureCard>
        </Features>

        <Button onClick={handleClick} disabled={buttonDisabled} isLoading={isLoading}>
          {!rpc ? 'Connecting to peer...' : 'Load Preview'}
        </Button>
      </ContentWrapper>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(120deg, #fdfbfb, #ebedee);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  text-align: center;
`;

const HeaderText = styled.h1<{ error?: boolean }>`
  font-size: 3rem;
  font-weight: 300;
  color: #222;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
  background: ${({ error }) =>
    error
      ? 'linear-gradient(135deg, #ff4d4f, #ff7373, #ff4d4f)'
      : 'linear-gradient(135deg, #ff7eb3, #ff758c, #42a5f5)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 300%;
  animation: ${({ error }) =>
    error ? 'errorGradientAnimation 3s ease infinite alternate' : 'gradientAnimation 5s ease infinite alternate'};

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

  @keyframes errorGradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
`;

const SubHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  color: #555;
  margin-bottom: 2rem;
`;

const Features = styled.div`
  display: flex;
  gap: 2rem;
  margin: 3rem 0;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  max-width: 300px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-size: 1.25rem;
    margin: 1rem 0 0.5rem;
    color: #333;
  }

  p {
    font-size: 1rem;
    color: #555;
  }
`;

const Icon = styled.div`
  font-size: 2.5rem;
  color: #ff758c;
`;

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

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
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
