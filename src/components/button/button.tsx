/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

type Variant = 'blue' | 'pink';

const variants = {
  blue: css`
    background: linear-gradient(135deg, #42a5f5, #1e88e5);
  `,
  pink: css`
    background: linear-gradient(135deg, #ff7eb3, #ff758c);
  `,
} as const;

interface BaseProps {
  variant?: Variant;
  isLoading?: boolean;
  className?: string;
}

type ButtonElementProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  tag?: 'button';
  href?: never;
};

type AnchorElementProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  tag: 'a';
  href: string;
};

export type ButtonProps = ButtonElementProps | AnchorElementProps;

const baseStyles = css`
  display: inline-block;
  font-size: 1.25rem;
  padding: 1rem 2.5rem;
  color: #ffffff;
  border: none;
  border-radius: 3rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;

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
`;

const loadingStyles = css`
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

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const StyledButton = styled.button<ButtonElementProps>`
  ${baseStyles}
  ${({ variant = 'pink' }) => variants[variant]}
  ${({ isLoading }) => isLoading && loadingStyles}
`;

const StyledAnchor = styled.a<AnchorElementProps>`
  ${baseStyles}
  ${({ variant = 'pink' }) => variants[variant]}
  ${({ isLoading }) => isLoading && loadingStyles}
`;

export const Button: FC<ButtonProps> = (props) => {
  const { tag = 'button' } = props;

  if (tag === 'a') {
    const { tag: _, ...anchorProps } = props;
    return <StyledAnchor {...(anchorProps as AnchorElementProps)} />;
  }

  const { tag: _, ...buttonProps } = props;
  return <StyledButton {...(buttonProps as ButtonElementProps)} />;
};
