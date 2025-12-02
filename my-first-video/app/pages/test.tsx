import React, { useState, useEffect } from 'react';

const CARDS = 10;
const MAX_VISIBILITY = 3;
const AUTO_SCROLL_INTERVAL = 3000; // 3 seconds

interface CardProps {
  title: string;
  content: string;
}

const Card = ({ title, content }: CardProps) => (
  <div className='carousel-card'>
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

interface CarouselProps {
  children: React.ReactNode;
}

const ChevronLeft = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Carousel = ({ children }: CarouselProps) => {
  const [active, setActive] = useState(2);
  const count = React.Children.count(children);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => {
        // Loop back to start when reaching the end
        if (prev >= count - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className='carousel-container'>
      {active > 0 && (
        <button className='carousel-nav left' onClick={() => setActive(i => i - 1)}>
          <ChevronLeft />
        </button>
      )}
      {React.Children.map(children, (child, i) => (
        <div
          className='carousel-card-container'
          style={{
            // @ts-ignore - CSS custom properties
            '--active': i === active ? 1 : 0,
            '--offset': (active - i) / 3,
            '--direction': Math.sign(active - i),
            '--abs-offset': Math.abs(active - i) / 3,
            pointerEvents: active === i ? 'auto' : 'none',
            opacity: Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
            display: Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block',
          }}
        >
          {child}
        </div>
      ))}
      {active < count - 1 && (
        <button className='carousel-nav right' onClick={() => setActive(i => i + 1)}>
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default function TestPage() {
  return (
    <div className='carousel-app'>
      <Carousel>
        {[...new Array(CARDS)].map((_, i) => (
          <Card
            key={i}
            title={'Card ' + (i + 1)}
            content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          />
        ))}
      </Carousel>
    </div>
  );
}