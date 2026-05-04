'use client';

import { ServiceType } from '@/types';

interface Props {
  type: ServiceType;
  icon: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function ServiceCard({ type, icon, description, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left p-5 rounded-2xl transition-all duration-300 active:scale-95
        ${selected
          ? 'border border-lavender/60 shadow-card-selected bg-white/[0.07]'
          : 'glass border-transparent hover:border-white/15 hover:bg-white/[0.06]'}
      `}
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl leading-none mt-0.5">{icon}</span>
        <div>
          <p className={`font-semibold text-sm mb-1 transition-colors ${selected ? 'text-lavender-light' : 'text-ivory'}`}>
            {type}
          </p>
          <p className="text-xs text-ivory-dim leading-relaxed">{description}</p>
        </div>
        <div className="ml-auto shrink-0 mt-0.5">
          <div className={`w-4 h-4 rounded-full border-2 transition-all ${selected ? 'border-lavender bg-lavender' : 'border-ivory-dim/40'}`} />
        </div>
      </div>
    </button>
  );
}
