'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Reading, FreeResult } from '@/types';
import { getReading } from '@/lib/firestore';
import { getCardById } from '@/lib/tarot-data';

const LOCKED_ITEMS = [
  { icon: '◯', label: '상대가 당신을 그리워하는 정도', value: '84%' },
  { icon: '✦', label: '먼저 연락해도 되는 최적 타이밍', value: '3일 후' },
  { icon: '◎', label: '재회 가능성 수치 분석', value: '67%' },
  { icon: '⊕', label: '절대 피해야 할 행동 4가지', value: '보기' },
  { icon: '☽', label: '앞으로 2주 감정 흐름 예측', value: '보기' },
  { icon: '♡', label: '지금 나만을 위한 마지막 조언', value: '보기' },
];

function FreeResultInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id') ?? '';

  const [reading, setReading] = useState<Reading | null>(null);
  const [freeResult, setFreeResult] = useState<FreeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600);

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

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

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
      <div className="page-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 rounded-full border-2 animate-spin mb-3"
            style={{ borderColor: 'rgba(177,156,217,0.5)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#9d96b0' }}>리딩을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!reading || !freeResult) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-sm" style={{ color: '#9d96b0' }}>리딩 정보를 찾을 수 없어요.</p>
          <button onClick={() => router.push('/')} className="text-sm underline" style={{ color: '#b19cd9' }}>
            홈으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen">
      <main className="px-4 py-10 max-w-lg mx-auto pb-32">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(139,107,181,0.15)', border: '1px solid rgba(139,107,181,0.3)', color: '#d4c5f0' }}>
            {reading.serviceType}
          </div>
          <h1 className="text-2xl font-extrabold text-ivory mb-1" style={{ letterSpacing: '-0.025em' }}>
            {reading.partnerName}님의 카드 해석
          </h1>
          <p className="text-sm" style={{ color: '#9d96b0' }}>
            {reading.userName}님을 위한 무료 리딩이에요.
          </p>
        </div>

        {/* Free card readings */}
        <div className="space-y-3 mb-8">
          {freeResult.cards.map((cr, i) => {
            const card = getCardById(cr.cardId);
            return (
              <div key={i} className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(177,156,217,0.15)',
                  backdropFilter: 'blur(16px)',
                }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#7c6bad' }}>
                  {cr.role}
                </p>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(177,156,217,0.12)', border: '1px solid rgba(177,156,217,0.2)' }}>
                    <span className="text-base" style={{ color: '#b19cd9' }}>{card?.symbol}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ivory">{card?.nameKo}</p>
                    {cr.isReversed && (
                      <span className="text-[10px]" style={{ color: '#c9956c' }}>역방향</span>
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#9d96b0' }}>{cr.shortReading}</p>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-5 mb-8"
          style={{
            background: 'linear-gradient(145deg, rgba(177,156,217,0.1), rgba(8,4,18,0.7))',
            border: '1px solid rgba(177,156,217,0.25)',
          }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#7c6bad' }}>
            종합 요약
          </p>
          <p className="text-sm leading-relaxed text-ivory">{freeResult.summary}</p>
        </div>

        {/* Locked section with blur overlay */}
        <div className="mb-2">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: '#5e5870' }}>
            정밀 리포트에서 확인 가능
          </p>
          <div className="relative">
            <div className="space-y-2.5">
              {LOCKED_ITEMS.map((item, i) => (
                <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    filter: i >= 2 ? 'blur(3px)' : undefined,
                    opacity: i >= 4 ? 0.4 : i >= 2 ? 0.7 : 1,
                  }}>
                  <span className="text-base shrink-0" style={{ color: '#7c6bad' }}>{item.icon}</span>
                  <p className="text-xs flex-1" style={{ color: '#9d96b0' }}>{item.label}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(177,156,217,0.1)', color: '#b19cd9' }}>
                    🔒
                  </span>
                </div>
              ))}
            </div>
            {/* Gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, #080412 100%)' }} />
          </div>
        </div>

        {/* Urgency timer */}
        <div className="flex items-center justify-center gap-2 py-3 mb-5 rounded-xl"
          style={{ background: 'rgba(201,149,108,0.08)', border: '1px solid rgba(201,149,108,0.2)' }}>
          <span className="text-xs font-bold" style={{ color: '#e0b48c' }}>⏱ 할인 마감까지</span>
          <span className="font-bold tabular-nums" style={{ color: '#e0b48c', fontSize: '15px' }}>
            {mins}:{secs}
          </span>
        </div>

        {/* Main CTA block */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(201,149,108,0.3)' }}>
          <div className="px-5 pt-5 pb-4" style={{ background: 'rgba(201,149,108,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(201,149,108,0.2)', border: '1px solid rgba(201,149,108,0.3)' }}>
                <span style={{ color: '#e0b48c', fontSize: '14px' }}>✦</span>
              </div>
              <p className="text-xs font-bold" style={{ color: '#e0b48c' }}>AI 정밀 리포트</p>
            </div>
            <h2 className="text-lg font-extrabold text-ivory mb-1" style={{ letterSpacing: '-0.02em' }}>
              {reading.partnerName}님의 진짜 속마음,<br />지금 전부 확인하세요
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: '#9d96b0' }}>
              연락 가능성 %, 재회 확률, 먼저 연락 타이밍,<br />
              피해야 할 행동 4가지까지 정밀 분석해드려요.
            </p>
          </div>

          <div className="px-5 pb-5 pt-4" style={{ background: 'rgba(8,4,18,0.6)' }}>
            {/* Social proof */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-1.5">
                {['💜', '🩷', '💙'].map((e, i) => (
                  <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                    style={{ background: 'rgba(139,107,181,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {e}
                  </div>
                ))}
              </div>
              <p className="text-[11px]" style={{ color: '#5e5870' }}>
                최근 24시간 내 <span className="font-bold" style={{ color: '#9d96b0' }}>342명</span>이 열람했어요
              </p>
            </div>

            <button type="button" onClick={handlePay}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] mb-2"
              style={{
                background: 'linear-gradient(135deg, #c9956c 0%, #e0b48c 100%)',
                color: '#1a0a2e',
                boxShadow: '0 4px 28px rgba(201,149,108,0.45)',
              }}>
              정밀 리포트 열기 — 4,900원 →
            </button>
            <p className="text-center text-[11px]" style={{ color: '#5e5870' }}>
              오늘만 첫 리딩 할인 적용 · 결제 후 즉시 열람
            </p>
          </div>
        </div>

        {/* Mini reviews */}
        <div className="mt-5 space-y-2">
          {[
            { text: '"보자마자 소름... 진짜 맞아서 두번이나 읽었어요 ㅠㅠ"', name: '20대 / 서울' },
            { text: '"연락 올 타이밍 그날 진짜 왔음 ㄷㄷ 신기해서 친구한테 공유"', name: '20대 / 인천' },
          ].map((r, i) => (
            <div key={i} className="rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs leading-relaxed mb-1.5" style={{ color: '#d4c5f0' }}>{r.text}</p>
              <p className="text-[10px]" style={{ color: '#5e5870' }}>{r.name}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 z-50"
        style={{ background: 'linear-gradient(to top, #080412 60%, transparent)' }}>
        <button type="button" onClick={handlePay}
          className="w-full max-w-lg mx-auto block py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #c9956c 0%, #e0b48c 100%)',
            color: '#1a0a2e',
            boxShadow: '0 4px 28px rgba(201,149,108,0.45)',
          }}>
          정밀 리포트 열기 4,900원 →
        </button>
      </div>
    </div>
  );
}

export default function FreeResultPage() {
  return <Suspense><FreeResultInner /></Suspense>;
}
