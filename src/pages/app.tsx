import { type FC } from 'react';

// Components
import { Article } from '@/components/article';
import { Button } from '@/components/button';

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
        <Button
          tag='a'
          href={spotServeGuiGithub}
          target='_blank'
          rel='noopener noreferrer'
        >
          Download Desktop App
        </Button>
      </Article.Content>
    </Article>
  );
};
