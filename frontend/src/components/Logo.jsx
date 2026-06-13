import React from 'react';

const Logo = ({ className = '', iconOnly = false, light = false, showTagline = false, iconSize = 'h-8 w-8' }) => {
  const textColor = light ? 'text-white' : 'text-slate-900';
  const accentColor = light ? 'text-[#EC4899]' : 'text-[#5B21B6]'; // magenta-pink on dark, deep violet on light
  
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* SVG Icon */}
      <div className={`relative ${iconSize} flex-shrink-0`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_1px_2px_rgba(91,33,182,0.1)]"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="logo-left-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4C1D95" /> {/* deep violet */}
              <stop offset="100%" stopColor="#7C3AED" /> {/* medium violet */}
            </linearGradient>
            <linearGradient id="logo-right-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DB2777" /> {/* dark magenta */}
              <stop offset="100%" stopColor="#EC4899" /> {/* accent pink */}
            </linearGradient>
            <linearGradient id="logo-middle-blend" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6D28D9" /> {/* blend mid-violet */}
              <stop offset="100%" stopColor="#D946EF" /> {/* blend fuchsia */}
            </linearGradient>
          </defs>
          
          {/* Left Speech Bubble - Violet */}
          <path
            d="M14.5 5.5C11.5 8.5 7.5 13.5 7.5 19.5C7.5 23.5 10.5 26.5 14.5 26.5C15.8 26.5 17 25.5 17.8 24.2L14.2 11.5L14.5 5.5Z"
            fill="url(#logo-left-grad)"
          />
          
          {/* Right Speech Bubble - Pink */}
          <path
            d="M17.5 5.5C20.5 8.5 24.5 13.5 24.5 19.5C24.5 23.5 21.5 26.5 17.5 26.5C16.2 26.5 15 25.5 14.2 24.2L17.8 11.5L17.5 5.5Z"
            fill="url(#logo-right-grad)"
          />

          {/* Overlap Union Area (Chevron center) */}
          <path
            d="M14.5 5.5C15.5 7.5 16.5 11 16.5 14C16.5 17 15.5 21 14.2 24.2C15 25.5 16.2 26.5 17.5 26.5C16.5 25.5 15.5 21 15.5 17C15.5 14 16.5 7.5 14.5 5.5Z"
            fill="url(#logo-middle-blend)"
          />
          
          {/* Speech bubble tail details pointing inwards/downwards */}
          <path
            d="M10.5 24.5L13.5 26.5H9.5L10.5 24.5Z"
            fill="#5B21B6"
          />
          <path
            d="M21.5 24.5L18.5 26.5H22.5L21.5 24.5Z"
            fill="#EC4899"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col justify-center select-none">
          <span className="text-xl font-extrabold tracking-tight">
            <span className={`${textColor} font-black`}>MENT</span>
            <span className={`${accentColor} font-bold`}>os</span>
          </span>
          {showTagline && (
            <span className={`text-[9px] tracking-wider uppercase mt-0.5 font-bold ${light ? 'text-violet-200' : 'text-slate-400'}`}>
              Learn from Those Who've Been There.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
