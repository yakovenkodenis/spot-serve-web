import { type FC } from 'react';

export const LogoIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="48"
    height="48"
  >
    <defs>
      <linearGradient id="gradient" gradientTransform="rotate(135)">
        <stop offset="0%" stopColor="#ff7eb3">
          <animate
            attributeName="stop-color"
            values="#ff7eb3; #ff758c; #42a5f5; #ff7eb3"
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
          />
        </stop>
        <stop offset="50%" stopColor="#ff758c">
          <animate
            attributeName="stop-color"
            values="#ff758c; #42a5f5; #ff7eb3; #ff758c"
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
          />
        </stop>
        <stop offset="100%" stopColor="#42a5f5">
          <animate
            attributeName="stop-color"
            values="#42a5f5; #ff7eb3; #ff758c; #42a5f5"
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
          />
        </stop>
      </linearGradient>
    </defs>
    
    {/* Main circular orbit */}
    <circle 
      cx="32" 
      cy="32" 
      r="20"
      fill="none"
      stroke="url(#gradient)"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      opacity="0.6"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0;8"
        dur="2s"
        repeatCount="indefinite"
        calcMode="linear"
      />
    </circle>
    
    {/* Central dot */}
    <circle 
      cx="32" 
      cy="32" 
      r="3"
      fill="url(#gradient)"
    />
    
    {/* Orbiting dot */}
    <circle 
      cx="32" 
      cy="12" 
      r="2"
      fill="url(#gradient)"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 32 32"
        to="360 32 32"
        dur="4s"
        repeatCount="indefinite"
        calcMode="linear"
      />
    </circle>

    {/* Inner connecting lines */}
    <path
      d="M32,29 L32,35"
      stroke="url(#gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M29,32 L35,32"
      stroke="url(#gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
