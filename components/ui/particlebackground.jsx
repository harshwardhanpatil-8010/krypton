"use client";
import React, { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const initParticles = () => {
      particles.current = [];
      const particleCount = Math.min(window.innerWidth / 10, 100);

      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${particle.opacity})`;
        ctx.fill();

        // Mouse interaction
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          particle.x -= Math.cos(angle) * 0.2;
          particle.y -= Math.sin(angle) * 0.2;
          particle.opacity = Math.min(particle.opacity + 0.02, 0.8);
        } else {
          particle.opacity = Math.max(particle.opacity - 0.01, 0.2);
        }
      });

      // Connect particles
      particles.current.forEach((particleA, i) => {
        particles.current.slice(i + 1).forEach((particleB) => {
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    handleResize();
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-60 pointer-events-none" />;
};

export default ParticleBackground;
