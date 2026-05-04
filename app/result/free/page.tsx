'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Reading, FreeResult } from '@/types';
import { getReading } from '@/lib/firestore';
import { getCardById } from '@/lib/tarot-data';

const LOCKED_ITEMS = [
  { label: '상대가 당신을 그리워하는 정도', icon: '◯' },
  { label: '연락이 올 가능성', icon: '✦' },
  { label: '먼저 연락해도 되는 타이밍', icon: '◎' },
  { label: '재회 가능성', icon: '♡' },
  { label: '피해야 할 행동', icon: '⊕' },
  { label: '앞으로 2주 흐름 전체', icon: '☽' },
];

function FreeResultInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id') ?? '';

  const [reading, setReading] = useState<Reading | null>(null);
  const [freeResult, setFreeResult] = useState<FreeResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
      let r: Reading | null = null;
      if (useMock) {
        const raw = sessionStorage.getItem(id);
        if (raw) r = { ...JSON.parse(raw), id };
      } else {
        r = await getReading(id);
      }
      if (r) {
        setReading(r);
        setFreeResult(r.freeResult ?? null);
      }
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  const handlePay = () => {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
    if (useMock) {
      router.push(`/result/premium?id=${id}&mock=true`);
    } else {
      fetch(`/api/checkout?id=${id}`)
        .then((r) => r.json())
        .then(({ url }) => { if (url) window.location.href = url; });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block w-8 h-8 rounded-full border-2 animate-spin mb-3"
            style={{ borderColor: 'rgba(177,156,217,0.5)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm text-ivory-dim/70">리딩 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (!reading || !freeResult) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-ivory-dim/70 mb-4">리딩 정보를 찾을 수 없어요.</p>
          <button onClick={() => router.push('/')} className="text-lavender text-sm underline">홈으로</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 max-w-lg mx-auto pb-32">
      {/* Header */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{ background: 'rgba(177,156,217,0.12)', color: '#d4c5f0' }}
        >
          {reading.serviceType}
        </div>
        <h1 className="text-2xl font-extrabold text-ivory mb-1" style={{ letterSpacing: '-0.02em' }}>
          {reading.partnerName}님의 카드 해석
        </h1>
        <p className="text-sm text-ivory-dim/70">{reading.userName}님을 위한 무료 리딩이에요.</p>
      </div>

      {/* Free card readings */}
      <div className="space-y-3 mb-8">
        {freeResult.cards.map((cr, i) => {
          const card = getCardById(cr.cardId);
          return (
            <div
              key={i}
              className="rounded-2xl p-4 glass"
              style={{ border: '1px solid rgba(177,156,217,0.15)' }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-lavender/60 mb-2">{cr.role}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{card?.symbol}</span>
                <div>
                  <p className="text-sm font-bold text-ivory">{card?.nameKo}</p>
                  {cr.isReversed && <span className="text-[10px] text-rose-gold/70">역방향</span>}
                </div>
              </div>
              <p className="text-xs text-ivory-dim/80 leading-relaxed">{cr.shortReading}</p>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div
        className="rounded-2xl p-5 mb-8"
        style={{
          background: 'linear-gradient(145deg, rgba(177,156,217,0.1), rgba(13,8,32,0.6))',
          border: '1px solid rgba(177,156,217,0.2)',
        }}
      >
        <p className="text-xs font-bold tracking-widest uppercase text-lavender/60 mb-2">종합 요약</p>
        <p className="text-sm text-ivory/90 leading-relaxed">{freeResult.summary}</p>
      </div>

      {/* Locked premium section */}
      <div className="blur-overlay mb-2">
        <div className="space-y-2.5 pb-8">
          {LOCKED_ITEMS.map((item) => (
            <div
              key={item.label}
              className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', filter: 'blur(3px)' }}
            >
              <span className="text-base text-lavender/50">{item.icon}</span>
              <p className="text-xs text-ivory/60">{item.label}</p>
              <div className="ml-auto w-16 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl p-5 text-center"
        style={{ border: '1px solid rgba(201,149,108,0.3)', background: 'rgba(201,149,108,0.06)' }}
      >
        <p className="text-xs font-bold tracking-widest uppercase text-rose-gold/70 mb-2">정밀 리포트</p>
        <p className="text-base font-extrabold text-ivory mb-1">상대의 속마음을 전부 알고 싶다면</p>
        <p className="text-xs text-ivory-dim/70 mb-4 leading-relaxed">
          연락 가능성, 재회 확률, 피해야 할 행동,<br />
          앞으로 2주 흐름까지 정밀하게 분석해드려요.
        </p>
        <button
          type="button"
          onClick={handlePay}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #c9956c 0%, #e0b48c 100%)',
            color: '#1a0f35',
            boxShadow: '0 0 24px rgba(201,149,108,0.35)',
          }}
        >
          정밀 리포트 열기 — 4,900원
        </button>
        <p className="text-[10px] text-ivory/30 mt-3">결제 후 즉시 리포트를 확인할 수 있어요</p>
      </div>
    </main>
  );
}

export default function FreeResultPage() {
  return (
    <Suspense>
      <FreeResultInner />
    </Suspense>
  );
}
