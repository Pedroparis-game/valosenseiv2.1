import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle parallax for the background blobs based on mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-hud-base text-text-main relative overflow-hidden font-body selection:bg-accent-primary/30">
      {/* Background Animated Blobs (CSS handled, hardware accelerated) */}
      <div 
        className="bg-glow-blob" 
        style={{ transform: `translate(${mousePos.x * -2}vw, ${mousePos.y * -2}vh)` }} 
      />
      <div 
        className="bg-glow-blob-2" 
        style={{ transform: `translate(${mousePos.x * 2}vw, ${mousePos.y * 2}vh)` }} 
      />
      
      {/* Structural Grid overlay */}
      <div className="fixed inset-0 hud-grid-bg opacity-30 pointer-events-none z-0 mix-blend-screen" />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow flex flex-col px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
