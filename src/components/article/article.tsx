import { type FC, type PropsWithChildren } from 'react';
import styled from '@emotion/styled';

interface ArticleComponent extends FC<PropsWithChildren> {
  Header: FC<PropsWithChildren>;
  Content: FC<PropsWithChildren>;
}

export const Article: ArticleComponent = ({ children }) => {
  return (
    <PageContainer>
      <Wrapper>
        {children}
      </Wrapper>
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

const Wrapper = styled.article`
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

Article.Header = Header;
Article.Content = Content;
