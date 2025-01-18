import { FC } from 'react';
import styled from '@emotion/styled';

export const Component: FC = () => {
  return (
    <PageContainer>
      <Article>
        <Header>
          <h1>About Spot Serve</h1>
        </Header>
        <Content>
          <p>
            Welcome to <strong>Spot Serve</strong>, a seamless solution for developers to share quick, interactive previews of their websites. Our app bridges the gap between creation and presentation by leveraging modern technologies to simplify the preview process.
          </p>
          <p>
            With Spot Serve, developers can upload their website files as a zip archive using our desktop app. Once uploaded, a unique URL is generated, allowing others to view a fully functional website preview directly in their browser. This preview is powered by cutting-edge <strong>WebRTC</strong> technology, ensuring fast and secure file sharing without the need for third-party hosting services.
          </p>
          <p>
            Spot Serve is designed with simplicity and performance in mind, enabling efficient collaboration between developers, designers, and clients. Whether you are showcasing a work-in-progress or delivering the final product, Spot Serve ensures a hassle-free experience every time.
          </p>
        </Content>
      </Article>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 4rem;
  background: linear-gradient(120deg, #fdfbfb, #ebedee);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #333;
`;

const Article = styled.article`
  max-width: 800px;
  width: 100%;
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const Header = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #222;
    text-align: center;
    background: linear-gradient(135deg, #ff7eb3, #ff758c, #42a5f5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Content = styled.div`
  font-size: 1.1rem;

  p {
    margin-bottom: 1.5rem;

    strong {
      color: #222;
    }
  }
`;
