import React, { useState, useEffect } from 'react';

export const MouseGradient: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 transition-all duration-500"
      style={{
        background: `radial-gradient(ellipse 25% 25% at ${mousePosition.x}% ${mousePosition.y}%, rgba(120,40,60,0.12) 0%, transparent 50%)`,
      }}
    />
  );
};
