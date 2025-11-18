"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Grid of dots
    class GridDot {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      offsetX: number;
      offsetY: number;
      phase: number;
      speed: number;

      constructor(x: number, y: number) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.offsetX = 0;
        this.offsetY = 0;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.01 + 0.005;
      }

      update(mouseX: number, mouseY: number) {
        // Gentle floating animation
        this.phase += this.speed;
        this.offsetX = Math.sin(this.phase) * 2;
        this.offsetY = Math.cos(this.phase * 0.8) * 2;

        // Mouse interaction - dots move away from cursor
        const dx = this.baseX - mouseX;
        const dy = this.baseY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 15;
          this.offsetX += (dx / distance) * force;
          this.offsetY += (dy / distance) * force;
        }

        this.x = this.baseX + this.offsetX;
        this.y = this.baseY + this.offsetY;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        context.fillStyle = "rgba(99, 102, 241, 0.3)";
        context.fill();
      }
    }

    // Create grid of dots
    const dots: GridDot[] = [];
    const spacing = 40; // Distance between dots
    const cols = Math.ceil(canvas.width / spacing) + 1;
    const rows = Math.ceil(canvas.height / spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push(new GridDot(i * spacing, j * spacing));
      }
    }

    // Mouse position tracking
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      // Clear canvas completely for transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw dots
      dots.forEach((dot) => {
        dot.update(mouseX, mouseY);
        dot.draw(ctx);
      });

      // Draw connections between nearby dots
      dots.forEach((dot1, i) => {
        dots.slice(i + 1).forEach((dot2) => {
          const dx = dot1.x - dot2.x;
          const dy = dot1.y - dot2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Only connect dots that are close enough
          if (distance < spacing * 1.5) {
            const opacity = (1 - distance / (spacing * 1.5)) * 0.15;
            
            ctx.beginPath();
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}