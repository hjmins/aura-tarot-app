'use client';

import { TarotCard as TarotCardType } from '@/types';

interface Props {
  card?: TarotCardType;
  index: number;
  isFlipped: boolean;
  isSelected: boolean;
  isRevealed: boolean;
  onClick?: () => void;
  role?: string;
  isReversed?: boolean;
  animationDelay?: number;
}

export default function TarotCard({
  card, index, isFlipped, isSelected, isRevealed, onClick, role, isReversed, animationDelay = 0,
}: Props) {
  return (
    <div
      className="perspective w-full"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div
        className={`card-inner ${isFlipped ? 'flipped' : ''}`}
        style={{ height: isRevealed ? 'auto' : '160px' }}
      >
        {/* 앞면 (뒷면이 보임 - 아직 선택 전) */}
        <div
          className={`
            card-face rounded-2xl flex flex-col items-center justify-center cursor-pointer
            transition-all duration-300 h-40
            ${isSelected
              ? 'shadow-card-selected border border-lavender/60'
              : 'glass border-transparent hover:border-white/20'}
          `}
          onClick={onClick}
          style={{
            background: isSelected
              ? 'linear-gradient(145deg, rgba(177,156,217,0.15), rgba(13,8,32,0.7))'
              : 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(13,8,32,0.5))',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
            style={{ background: 'rgba(177,156,217,0.15)', border: '1px solid rgba(177,156,217,0.3)' }}
          >
            <span className="text-lavender text-lg">✦</span>
          </div>
          <p className="text-xs text-ivory-dim/60">{isSelected ? '선택됨' : `카드 ${index + 1}`}</p>
        </div>

        {/* 뒷면 (카드 내용 공개) */}
        <div
          className={`
            card-back-face rounded-2xl p-4 flex flex-col gap-2 border
            ${isSelected ? 'border-lavender/40' : 'border-white/10'}
          `}
          style={{
            background: 'linear-gradient(145deg, rgba(177,156,217,0.1), rgba(13,8,32,0.8))',
            height: 'auto',
            minHeight: '160px',
          }}
        >
          {role && (
            <p className="text-[10px] font-bold tracking-widest uppercase text-lavender/70">{role}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">{card?.symbol}</span>
            <div>
              <p className="text-sm font-bold text-ivory">{card?.nameKo}</p>
              {isReversed && (
                <span className="text-[10px] text-rose-gold/80">역방향</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {card?.keywords.map((kw) => (
              <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full text-lavender-light/70" style={{ background: 'rgba(177,156,217,0.1)' }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
