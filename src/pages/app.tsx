import { FC } from 'react';
import styled from '@emotion/styled';

// Components
import { Article } from '@/components/article';

// Constants
import { spotServeGuiGithub } from '@/constants/external-links';

export const Component: FC = () => {
  return (
    <Article>
      <Article.Header>
        <h1>Download Spot Serve</h1>
      </Article.Header>
      <Article.Content>
        <p>
          The <strong>Spot Serve</strong> desktop app lets you upload your website files and generate unique links for
          sharing interactive previews.
        </p>
        <p>To download the desktop app, visit our GitHub repository.</p>
        <DownloadLink href={spotServeGuiGithub} target='_blank' rel='noopener noreferrer'>
          Download Desktop App
        </DownloadLink>
      </Article.Content>
    </Article>
  );
};

const DownloadLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  font-size: 1.25rem;
  color: #ffffff;
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  padding: 1rem 2rem;
  border-radius: 3rem;
  text-align: center;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;
