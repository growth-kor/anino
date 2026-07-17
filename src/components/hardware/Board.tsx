import React from 'react';

interface BoardProps {
  x: number;
  y: number;
  onPinClick?: (pinId: string) => void;
  activePins?: string[];
  highlight?: 'mcu' | 'digital' | 'analog' | 'txrx' | 'none';
}

export const UnoBoard: React.FC<BoardProps> = ({ x, y, onPinClick, activePins = [], highlight = 'none' }) => {
  const width = 360;
  const height = 250;

  // Pin offsets relative to board (x, y)
  const topPins = Array.from({ length: 14 }, (_, i) => ({ id: `UNO-D${13 - i}`, label: `${13 - i}`, x: 70 + i * 18, y: 15 }));
  topPins.push({ id: 'UNO-GND-1', label: 'GND', x: 70 + 14 * 18, y: 15 });
  topPins.push({ id: 'UNO-AREF', label: 'AREF', x: 70 + 15 * 18, y: 15 });

  const bottomPowerPins = [
    { id: 'UNO-VIN', label: 'VIN', x: 90, y: height - 15 },
    { id: 'UNO-GND-2', label: 'GND', x: 108, y: height - 15 },
    { id: 'UNO-GND-3', label: 'GND', x: 126, y: height - 15 },
    { id: 'UNO-5V', label: '5V', x: 144, y: height - 15 },
    { id: 'UNO-3V3', label: '3.3V', x: 162, y: height - 15 },
    { id: 'UNO-RESET', label: 'RST', x: 180, y: height - 15 },
  ];

  const bottomAnalogPins = Array.from({ length: 6 }, (_, i) => ({
    id: `UNO-A${i}`, label: `A${i}`, x: 216 + i * 18, y: height - 15
  }));

  const allPins = [...topPins, ...bottomPowerPins, ...bottomAnalogPins];

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <linearGradient id="board-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="board-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Board Shadow */}
      <rect x="2" y="2" width={width} height={height} rx="12" fill="#000" opacity="0.4" />

      {/* Board Base (Premium Matte Blue-Grey) */}
      <rect x="0" y="0" width={width} height={height} rx="12" 
            fill="url(#board-gradient)" 
            stroke="#4f46e5" 
            strokeWidth="2" />

      {/* Visual Highlight Rings (Added for Educational Clarity) */}
      {highlight === 'mcu' && (
        <rect x={width / 2 - 38} y={height / 2 - 18} width="76" height="36" rx="5" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.95" filter="url(#board-glow)" />
      )}
      {highlight === 'txrx' && (
        <rect x={110} y={80} width="40" height="35" rx="5" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.95" filter="url(#board-glow)" />
      )}
      {highlight === 'digital' && (
        <rect x={60} y={5} width="290" height="20" rx="5" fill="none" stroke="#818cf8" strokeWidth="3" opacity="0.95" filter="url(#board-glow)" />
      )}
      {highlight === 'analog' && (
        <rect x={205} y={height - 25} width="120" height="20" rx="5" fill="none" stroke="#f472b6" strokeWidth="3" opacity="0.95" filter="url(#board-glow)" />
      )}

      {/* Hardware Details (Microcontroller Chip) */}
      <rect x={width / 2 - 35} y={height / 2 - 15} width="70" height="30" rx="3" fill="#09090b" stroke="#1e293b" strokeWidth="1.5" />
      <text x={width / 2} y={height / 2 + 4} fill="#4b5563" fontSize="8" fontFamily="monospace" textAnchor="middle">ATMEGA328P</text>

      {/* USB Port (Sleek Metal Effect) */}
      <rect x="-10" y="30" width="22" height="35" rx="2" fill="#475569" stroke="#334155" />
      <rect x="-6" y="35" width="14" height="25" fill="#1e293b" />

      {/* Power Jack */}
      <rect x="-10" y="170" width="28" height="32" rx="2" fill="#0f172a" stroke="#1e293b" />

      {/* TX/RX Indicators */}
      <circle cx={120} cy={90} r={3} fill="#22c55e" opacity="0.4" />
      <text x={130} y={93} fill="#64748b" fontSize="7" fontFamily="monospace">TX</text>
      <circle cx={120} cy={102} r={3} fill="#22c55e" opacity="0.4" />
      <text x={130} y={105} fill="#64748b" fontSize="7" fontFamily="monospace">RX</text>

      {/* Pins Headers Rendering */}
      {allPins.map(pin => {
        const isActive = activePins.includes(pin.id);
        return (
          <g key={pin.id} transform={`translate(${pin.x}, ${pin.y})`} 
             onClick={(e) => {
               e.stopPropagation();
               onPinClick && onPinClick(pin.id);
             }}
             style={{ cursor: 'pointer' }}>
            
            {/* Header Outer Square */}
            <rect x="-6" y="-6" width="12" height="12" fill="#09090b" stroke="#334155" strokeWidth="1" rx="1" />
            
            {/* Inner Metallic Hole */}
            <circle cx="0" cy="0" r="3" fill={isActive ? "#6366f1" : "#1e293b"} />
            <circle cx="0" cy="0" r="1.5" fill={isActive ? "#a5b4fc" : "#020617"} />

            {/* Glowing effect when selected */}
            {isActive && (
              <circle cx="0" cy="0" r="6" fill="none" stroke="#818cf8" strokeWidth="1.5" opacity="0.8" filter="url(#board-glow)" />
            )}
            
            {/* Text Pin Label */}
            <text x="0" y={pin.y < height / 2 ? 16 : -10} 
                  fill="#94a3b8" fontSize="8" fontFamily="monospace" 
                  textAnchor="middle" fontWeight="bold">
              {pin.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};
