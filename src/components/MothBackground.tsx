"use client";

import React, { useRef, useEffect } from 'react';

// --- You can customize these values ---
const MOTH_COUNT = 40;
const MOTH_COLOR = "rgba(255, 255, 255, 0.6)";
const LIGHT_COLOR = "rgba(255, 220, 180, 0.1)";
const LIGHT_SIZE = 600;
// ------------------------------------

export default function MothBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let moths: Moth[] = [];
    
    const light = {
      x: window.innerWidth - (window.innerWidth / 5),
      y: window.innerHeight / 5,
    };

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      light.x = window.innerWidth - (window.innerWidth / 5);
      light.y = window.innerHeight / 5;
    };
    setCanvasDimensions();

    class Moth {
      x: number;
      y: number;
      size: number;
      angle: number;
      speed: number;
      targetRadius: number;
      radius: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.1;
        this.targetRadius = Math.random() * 150 + 50;
        this.radius = this.targetRadius;
      }

      update() {
        const dx = light.x - this.x;
        const dy = light.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.angle += (Math.random() - 0.5) * 0.1;
        this.radius += (this.targetRadius - this.radius) * 0.1;

        const spiralFactor = 1 + Math.sin(this.angle * 5 + performance.now() / 1000) * 0.2;
        
        this.x += (dx / distance) * this.speed * 1.5 + Math.cos(this.angle) * this.speed * spiralFactor;
        this.y += (dy / distance) * this.speed * 1.5 + Math.sin(this.angle) * this.speed * spiralFactor;
        
        if (Math.random() > 0.99) {
            this.targetRadius = Math.random() * 150 + 50;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = MOTH_COLOR;
        ctx!.fill();
      }
    }

    function init() {
      moths = [];
      for (let i = 0; i < MOTH_COUNT; i++) {
        moths.push(new Moth());
      }
    }

    let animationFrameId: number;
    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const moth of moths) {
        moth.update();
        moth.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      setCanvasDimensions();
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none">
      <div 
        ref={lightRef}
        className="absolute top-[10%] right-[10%]"
        style={{
            background: `radial-gradient(${LIGHT_SIZE}px at center, ${LIGHT_COLOR}, transparent 80%)`,
            filter: 'blur(20px)',
        }}
      />
      <canvas ref={canvasRef} />
    </div>
  );
}