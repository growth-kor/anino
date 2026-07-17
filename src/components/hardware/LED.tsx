import React from 'react';

interface LEDProps {
  x: number;
  y: number;
  color?: string;
  isOn?: boolean;
  isBurning?: boolean;
  onPinClick?: (pinId: string) => void;
  id: string;
}

export const LED: React.FC<LEDProps> = ({ 
  x, y, color = '#ef4444', isOn = false, isBurning = false, onPinClick, id 
}) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <radialGradient id={`led-glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={isOn ? 1 : 0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={isOn ? 0.3 : 0.1} />
        </radialGradient>
        <filter id={`led-blur-${id}`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes smoke-${id} {
              0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.8; }
              50% { transform: translateY(-20px) scale(1.5) rotate(10deg); opacity: 0.4; }
              100% { transform: translateY(-40px) scale(2) rotate(-10deg); opacity: 0; }
            }
            .smoke-particle {
              animation: smoke-${id} 2s infinite linear;
              transform-origin: center;
            }
          `}
        </style>
      </defs>

      {/* Legs (Pins) */}
      {/* Anode (Long leg, right) */}
      <path d="M 35 60 L 35 90" stroke="#94a3b8" strokeWidth="3" fill="none" />
      {/* Cathode (Short leg, left, slightly bent) */}
      <path d="M 25 60 L 25 80 L 20 85 L 20 90" stroke="#94a3b8" strokeWidth="3" fill="none" />

      {/* Pin Click Areas (Invisible Hitbox, larger for easy clicking) */}
      <circle cx={35} cy={90} r={16} fill="transparent" stroke={isOn ? "#fbbf24" : "transparent"} 
              strokeWidth={1} style={{ cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onPinClick?.(`${id}-ANODE`); }} />
      <circle cx={20} cy={90} r={16} fill="transparent" stroke={isOn ? "#fbbf24" : "transparent"} 
              strokeWidth={1} style={{ cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onPinClick?.(`${id}-CATHODE`); }} />

      {/* LED Bulb */}
      <path d="M 15 40 Q 15 20 30 20 Q 45 20 45 40 L 45 60 L 15 60 Z" 
            fill={isBurning ? '#1c1917' : `url(#led-glow-${id})`} 
            stroke={isBurning ? '#444' : color} 
            strokeWidth="1.5"
            filter={isOn && !isBurning ? `url(#led-blur-${id})` : undefined}
            opacity={isBurning ? 0.8 : 1}
      />
      {/* Bulb Base */}
      <rect x={12} y={58} width={36} height={5} rx={2} fill={isBurning ? '#292524' : color} opacity={0.8} />

      {/* Burning Smoke Effect */}
      {isBurning && (
        <g transform="translate(30, 20)">
          <circle cx={-5} cy={-5} r={4} fill="#57534e" className="smoke-particle" style={{ animationDelay: '0s' }} />
          <circle cx={5} cy={-10} r={5} fill="#78716c" className="smoke-particle" style={{ animationDelay: '0.5s' }} />
          <circle cx={0} cy={-15} r={6} fill="#44403c" className="smoke-particle" style={{ animationDelay: '1s' }} />
        </g>
      )}

      {/* Labels */}
      <text x={35} y={105} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">+</text>
      <text x={20} y={105} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">-</text>
    </g>
  );
};
