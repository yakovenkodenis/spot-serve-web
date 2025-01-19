import { type FC } from 'react';
import styled from '@emotion/styled';

// Components
import { Article } from '@/components/article';

// Constants
import { spotServeWebGithubIssues } from '@/constants/external-links';

export const Component: FC = () => {
  return (
    <Article>
      <Article.Header>
        <h1>Support</h1>
      </Article.Header>
      <Article.Content>
        <p>
          For any issues or questions regarding <strong>Spot Serve</strong>, please visit our GitHub repository.
        </p>
        <p>You can create an issue directly on GitHub, and we’ll address it as soon as possible.</p>
        <SupportLink href={spotServeWebGithubIssues} target='_blank' rel='noopener noreferrer'>
          Create an Issue on GitHub
        </SupportLink>
      </Article.Content>
    </Article>
  );
};

const SupportLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  font-size: 1.25rem;
  color: #ffffff;
  background: linear-gradient(135deg, #42a5f5, #1e88e5);
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
