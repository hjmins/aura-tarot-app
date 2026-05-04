'use client';

import { useEffect, useState } from 'react';

interface Props {
  label: string;
  value: number;
  color?: 'rose' | 'lavender';
  delay?: number;
}

export default function ProbabilityBar({ label, value, color = 'lavender', delay = 0 }: Props) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  const barColor = color === 'rose'
    ? 'linear-gradient(90deg, #c9956c, #e0b48c)'
    : 'linear-gradient(90deg, #8b6bb5, #b19cd9)';

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-ivory/90">{label}</p>
        <p className="text-lg font-bold" style={{ color: color === 'rose' ? '#e0b48c' : '#b19cd9' }}>
          {value}%
        </p>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
