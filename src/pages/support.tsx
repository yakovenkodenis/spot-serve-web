import { type FC } from 'react';

// Components
import { Article } from '@/components/article';
import { Button } from '@/components/button';

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
        <Button
          tag='a'
          variant='blue'
          href={spotServeWebGithubIssues}
          target='_blank'
          rel='noopener noreferrer'
        >
          Create an Issue on GitHub
        </Button>
      </Article.Content>
    </Article>
  );
};
