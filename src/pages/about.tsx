import { FC } from 'react';

// Components
import { Article } from '@/components/article';

export const Component: FC = () => {
  return (
    <Article>
      <Article.Header>
        <h1>About Spot Serve</h1>
      </Article.Header>
      <Article.Content>
        <p>
          Welcome to <strong>Spot Serve</strong>, a seamless solution for developers to share quick, interactive
          previews of their websites. Our app bridges the gap between creation and presentation by leveraging modern
          technologies to simplify the preview process.
        </p>
        <p>
          With Spot Serve, developers can upload their website files as a zip archive using our desktop app. Once
          uploaded, a unique URL is generated, allowing others to view a fully functional website preview directly in
          their browser. This preview is powered by cutting-edge <strong>WebRTC</strong> technology, ensuring fast and
          secure file sharing without the need for third-party hosting services.
        </p>
        <p>
          Spot Serve is designed with simplicity and performance in mind, enabling efficient collaboration between
          developers, designers, and clients. Whether you are showcasing a work-in-progress or delivering the final
          product, Spot Serve ensures a hassle-free experience every time.
        </p>
      </Article.Content>
    </Article>
  );
};
