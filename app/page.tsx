'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import { ServiceType } from '@/types';

const SERVICES: { type: ServiceType; icon: string; description: string }[] = [
  {
    type: '상대 속마음 보기',
    icon: '◯',
    description: '상대가 지금 나를 어떻게 생각하는지, 감추고 있는 감정이 무엇인지 알아봐요.',
  },
  {
    type: '연락 올 가능성 보기',
    icon: '✦',
    description: '상대에게서 연락이 올 가능성과 타이밍을 카드로 읽어봐요.',
  },
  {
    type: '재회 가능성 보기',
    icon: '◎',
    description: '헤어진 상대와 다시 연결될 가능성과 조건을 분석해드려요.',
  },
  {
    type: '직접 질문하기',
    icon: '∞',
    description: '내가 직접 질문을 입력하면 AI가 카드로 맞춤 답변을 해드려요.',
  },
];

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState<ServiceType | null>(null);

  const handleStart = () => {
    if (!selected) return;
    router.push(`/reading?service=${encodeURIComponent(selected)}`);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-8 text-center">
        <div className="mb-6 animate-fade-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(177,156,217,0.12)', border: '1px solid rgba(177,156,217,0.25)', color: '#d4c5f0' }}
          >
            ✦ &nbsp;AI 정밀 타로 리포트
          </div>

          <h1
            className="text-[2.4rem] sm:text-5xl font-extrabold leading-[1.15] mb-4"
            style={{ letterSpacing: '-0.03em', color: '#f0ebe0' }}
          >
            지금 상대는<br />
            <span style={{ color: '#b19cd9' }}>무슨 생각을</span><br />
            하고 있을까요?
          </h1>

          <p className="text-sm sm:text-base text-ivory-dim leading-relaxed max-w-xs mx-auto">
            카드 3장이 상대의 속마음,<br />
            연락 가능성, 앞으로의 흐름을 알려드려요.
          </p>
        </div>

        {/* Floating cards decoration */}
        <div className="relative w-48 h-28 mb-8 flex items-center justify-center">
          {['-rotate-12', 'rotate-0 z-10', 'rotate-12'].map((r, i) => (
            <div
              key={i}
              className={`absolute w-16 h-24 rounded-xl ${r} glass`}
              style={{
                left: `${i * 44}px`,
                border: '1px solid rgba(177,156,217,0.2)',
                background: 'linear-gradient(145deg, rgba(177,156,217,0.08), rgba(13,8,32,0.6))',
                boxShadow: i === 1 ? '0 0 20px rgba(177,156,217,0.2)' : undefined,
              }}
            >
              <div className="h-full flex items-center justify-center">
                <span className="text-lavender/50 text-xl">✦</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service selection */}
      <section className="px-4 pb-8 max-w-lg mx-auto w-full">
        <p className="text-xs font-bold tracking-widest uppercase text-ivory-dim/60 mb-3 text-center">
          어떤 걸 알고 싶으신가요?
        </p>
        <div className="grid grid-cols-1 gap-2.5 mb-6">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.type}
              type={s.type}
              icon={s.icon}
              description={s.description}
              selected={selected === s.type}
              onClick={() => setSelected(s.type)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: selected ? 'linear-gradient(135deg, #8b6bb5 0%, #b19cd9 100%)' : 'rgba(255,255,255,0.06)',
            color: selected ? '#fff' : 'rgba(240,235,224,0.3)',
            boxShadow: selected ? '0 0 24px rgba(177,156,217,0.3)' : undefined,
          }}
        >
          카드 뽑기 시작하기
        </button>

        <p className="text-xs text-ivory-dim/40 text-center mt-4">
          무료 카드 3장 해석 → 정밀 리포트 4,900원
        </p>
      </section>
    </main>
  );
}
