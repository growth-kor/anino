import React, { useEffect, useRef } from 'react';

interface Trace {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
  width: number;
}

export const CurrentFlowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate random PCB traces
    const traces: Trace[] = [];
    const numTraces = 35;

    const generateTrace = (): Trace => {
      const points: { x: number; y: number }[] = [];
      let currentX = Math.random() * width;
      let currentY = Math.random() * height;
      points.push({ x: currentX, y: currentY });

      const numSegments = 3 + Math.floor(Math.random() * 4);
      const segmentLength = 80 + Math.random() * 120;

      for (let i = 0; i < numSegments; i++) {
        const angleChoice = Math.floor(Math.random() * 4);
        let angle = 0;
        if (angleChoice === 1) angle = Math.PI / 2;     // 90 deg
        else if (angleChoice === 2) angle = Math.PI / 4; // 45 deg
        else if (angleChoice === 3) angle = -Math.PI / 4; // -45 deg

        currentX += Math.cos(angle) * segmentLength;
        currentY += Math.sin(angle) * segmentLength;

        currentX = Math.max(0, Math.min(width, currentX));
        currentY = Math.max(0, Math.min(height, currentY));

        points.push({ x: currentX, y: currentY });
      }

      return {
        points,
        progress: 0,
        speed: 0.003 + Math.random() * 0.005,
        width: 1 + Math.random() * 1.5,
      };
    };

    for (let i = 0; i < numTraces; i++) {
      traces.push(generateTrace());
    }

    const draw = () => {
      ctx.fillStyle = '#070a13'; 
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.07)';
      ctx.lineWidth = 1;
      traces.forEach((trace) => {
        ctx.beginPath();
        ctx.moveTo(trace.points[0].x, trace.points[0].y);
        for (let i = 1; i < trace.points.length; i++) {
          ctx.lineTo(trace.points[i].x, trace.points[i].y);
        }
        ctx.stroke();
      });

      traces.forEach((trace) => {
        const totalSegments = trace.points.length - 1;
        const exactSegment = trace.progress * totalSegments;
        const segmentIndex = Math.floor(exactSegment);
        const segmentProgress = exactSegment - segmentIndex;

        if (segmentIndex < totalSegments) {
          const p1 = trace.points[segmentIndex];
          const p2 = trace.points[segmentIndex + 1];

          const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
          const currentY = p1.y + (p2.y - p1.y) * segmentProgress;

          ctx.beginPath();
          ctx.arc(currentX, currentY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#818cf8'; 
          ctx.shadowColor = '#6366f1';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0; 

          ctx.beginPath();
          ctx.arc(currentX, currentY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }

        trace.progress += trace.speed;
        if (trace.progress >= 1) {
          const index = traces.indexOf(trace);
          traces[index] = generateTrace();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1, // Back to -1 to sit behind transparent parent wrapper
        background: '#070a13'
      }}
    />
  );
};
