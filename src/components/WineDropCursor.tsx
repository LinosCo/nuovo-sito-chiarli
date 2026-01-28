import React, { useEffect, useState } from 'react';

export const WineDropCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Add trail droplet occasionally
      if (Math.random() > 0.92) {
        const newDrop = { x: e.clientX, y: e.clientY, id: Date.now() };
        setTrail(prev => [...prev.slice(-8), newDrop]);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Clean up old trail drops
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.filter(drop => Date.now() - drop.id < 1500));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main wine drop */}
      <div
        className="fixed pointer-events-none z-50 hidden md:block"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Outer glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: '60px',
            height: '60px',
            left: '-30px',
            top: '-30px',
            background: 'radial-gradient(circle, rgba(87,15,26,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Wine drop shape */}
        <svg
          width="24"
          height="32"
          viewBox="0 0 24 32"
          className="drop-shadow-lg"
          style={{
            transform: 'translate(-12px, -16px)',
            filter: 'drop-shadow(0 4px 8px rgba(87,15,26,0.3))',
          }}
        >
          <defs>
            <linearGradient id="wineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B2635" />
              <stop offset="50%" stopColor="#570F1A" />
              <stop offset="100%" stopColor="#3D0A12" />
            </linearGradient>
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#570F1A" floodOpacity="0.4"/>
            </filter>
          </defs>
          {/* Drop shape - teardrop */}
          <path
            d="M12 0C12 0 0 14 0 20C0 26.627 5.373 32 12 32C18.627 32 24 26.627 24 20C24 14 12 0 12 0Z"
            fill="url(#wineGradient)"
            filter="url(#dropShadow)"
          />
          {/* Highlight */}
          <ellipse
            cx="8"
            cy="18"
            rx="3"
            ry="4"
            fill="rgba(255,255,255,0.25)"
          />
        </svg>
      </div>

      {/* Trail drops */}
      {trail.map((drop, index) => {
        const age = Date.now() - drop.id;
        const opacity = Math.max(0, 1 - age / 1500);
        const scale = 0.3 + (age / 1500) * 0.3;
        const yOffset = (age / 1500) * 40; // Drops fall down

        return (
          <div
            key={drop.id}
            className="fixed pointer-events-none z-40 hidden md:block"
            style={{
              left: drop.x,
              top: drop.y + yOffset,
              transform: 'translate(-50%, -50%)',
              opacity,
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: `${8 * scale}px`,
                height: `${12 * scale}px`,
                background: 'linear-gradient(180deg, #8B2635 0%, #570F1A 100%)',
                borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                boxShadow: '0 2px 4px rgba(87,15,26,0.3)',
              }}
            />
          </div>
        );
      })}

      <style>{`
        @keyframes drop-wobble {
          0%, 100% { transform: translate(-12px, -16px) rotate(0deg); }
          25% { transform: translate(-12px, -16px) rotate(2deg); }
          75% { transform: translate(-12px, -16px) rotate(-2deg); }
        }
      `}</style>
    </>
  );
};
