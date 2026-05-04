'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TAROT_CARDS } from '@/lib/tarot-data';
import { generateFreeResult } from '@/lib/ai';
import { updateSelectedCards, updateFreeResult, getReading } from '@/lib/firestore';
import { Reading } from '@/types';

const DECK_SIZE = 6;
const PICK_COUNT = 3;
const DISPLAY_CARDS = TAROT_CARDS.slice(0, DECK_SIZE);
const ROLES = ['과거 · 상대의 마음', '현재 · 지금 감정', '미래 · 앞으로 흐름'];

function CardsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id') ?? '';

  const [reading, setReading] = useState<Reading | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'pick' | 'reveal' | 'done'>('pick');

  useEffect(() => {
    const load = async () => {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
      if (useMock) {
        const raw = sessionStorage.getItem(id);
        if (raw) setReading({ ...JSON.parse(raw), id });
      } else {
        const r = await getReading(id);
        if (r) setReading(r);
      }
    };
    if (id) load();
  }, [id]);

  const toggleCard = (cardId: number) => {
    if (phase !== 'pick') return;
    setSelected((prev) => {
      if (prev.includes(cardId)) return prev.filter((c) => c !== cardId);
      if (prev.length >= PICK_COUNT) return prev;
      return [...prev, cardId];
    });
  };

  const handleReveal = async () => {
    if (selected.length < PICK_COUNT || !reading) return;
    setPhase('reveal');
    setLoading(true);

    for (let i = 0; i < selected.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setFlipped((prev) => [...prev, selected[i]]);
    }

    const updatedReading = { ...reading, selectedCards: selected };
    const freeResult = await generateFreeResult(updatedReading);

    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
    if (!useMock) {
      await updateSelectedCards(id, selected);
      await updateFreeResult(id, freeResult);
    } else {
      const stored = JSON.parse(sessionStorage.getItem(id) ?? '{}');
      sessionStorage.setItem(id, JSON.stringify({ ...stored, selectedCards: selected, freeResult }));
    }

    setLoading(false);
    setPhase('done');
  };

  const handleNext = () => router.push(`/result/free?id=${id}`);

  return (
    <div className="page-bg min-h-screen">
      <main className="px-4 py-10 max-w-lg mx-auto">

        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs mb-8 transition-colors hover:text-ivory"
          style={{ color: '#5e5870' }}>
          ← 뒤로
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(139,107,181,0.15)', border: '1px solid rgba(139,107,181,0.3)', color: '#d4c5f0' }}>
            ✦ 카드 선택
          </div>
          <h1 className="text-2xl font-extrabold text-ivory mb-2" style={{ letterSpacing: '-0.025em' }}>
            {phase === 'pick' ? '직감으로 3장의 카드를\n선택하세요' : '카드가 말하고 있어요'}
          </h1>
          <p className="text-sm" style={{ color: '#9d96b0' }}>
            {phase === 'pick'
              ? '당신의 무의식이 가장 정확한 답을 고릅니다'
              : '상대의 마음을 읽고 있어요...'}
          </p>
        </div>

        {/* Role progress tracker */}
        <div className="flex items-stretch gap-2 mb-8">
          {ROLES.map((role, i) => {
            const picked = i < selected.length;
            const active = i === selected.length;
            return (
              <div key={role} className="flex-1 rounded-xl px-2 py-2.5 text-center transition-all"
                style={{
                  background: picked
                    ? 'rgba(139,107,181,0.2)'
                    : active
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.02)',
                  border: picked
                    ? '1px solid rgba(177,156,217,0.5)'
                    : active
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(255,255,255,0.04)',
                  boxShadow: picked ? '0 0 12px rgba(139,107,181,0.25)' : undefined,
                }}>
                <div className="flex items-center justify-center mb-1">
                  {picked
                    ? <span style={{ color: '#b19cd9', fontSize: '12px' }}>✦</span>
                    : <span className="text-[10px] font-bold" style={{ color: active ? '#5e5870' : '#3e3850' }}>{i + 1}</span>
                  }
                </div>
                <p className="text-[9px] font-semibold leading-tight"
                  style={{ color: picked ? '#d4c5f0' : active ? '#5e5870' : '#3e3850' }}>
                  {role.split(' · ')[0]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Cards grid — 2 columns, 3 rows for large premium cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {DISPLAY_CARDS.map((card) => {
            const isSelected = selected.includes(card.id);
            const isFlipped = flipped.includes(card.id);
            const selectedIndex = selected.indexOf(card.id);
            const isDisabled = !isSelected && selected.length >= PICK_COUNT && phase === 'pick';

            return (
              <div key={card.id} className="perspective" style={{ height: '200px' }}>
                <div
                  className={`card-inner ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => !isDisabled && !isFlipped && toggleCard(card.id)}
                  style={{ cursor: isFlipped ? 'default' : isDisabled ? 'not-allowed' : 'pointer' }}
                >
                  {/* Card back (face-down) */}
                  <div className="card-face rounded-2xl flex flex-col items-center justify-center"
                    style={{
                      background: isDisabled
                        ? 'rgba(255,255,255,0.02)'
                        : isSelected
                        ? 'linear-gradient(155deg, rgba(139,107,181,0.28) 0%, rgba(8,4,18,0.95) 100%)'
                        : 'linear-gradient(155deg, rgba(139,107,181,0.15) 0%, rgba(8,4,18,0.95) 100%)',
                      border: isSelected
                        ? '1px solid rgba(177,156,217,0.6)'
                        : isDisabled
                        ? '1px solid rgba(255,255,255,0.04)'
                        : '1px solid rgba(177,156,217,0.2)',
                      boxShadow: isSelected
                        ? '0 0 0 2px rgba(139,107,181,0.4), 0 8px 32px rgba(0,0,0,0.5)'
                        : isDisabled
                        ? undefined
                        : '0 8px 32px rgba(0,0,0,0.5)',
                      transition: 'all 0.3s',
                    }}>

                    {isSelected && (
                      <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center z-10"
                        style={{ background: 'linear-gradient(135deg, #6b3fa0, #9b6dd0)', border: '2px solid rgba(255,255,255,0.2)' }}>
                        <span className="text-white text-[11px] font-bold">{selectedIndex + 1}</span>
                      </div>
                    )}

                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                      style={{
                        background: isDisabled ? 'rgba(255,255,255,0.02)' : 'rgba(177,156,217,0.12)',
                        border: isDisabled ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(177,156,217,0.25)',
                      }}>
                      <span style={{ color: isDisabled ? '#2a2535' : '#b19cd9', fontSize: '18px' }}>✦</span>
                    </div>
                    <div className="w-8 h-px mb-1.5"
                      style={{ background: isDisabled ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.4)' }} />
                    <div className="w-5 h-px"
                      style={{ background: isDisabled ? 'rgba(212,175,55,0.04)' : 'rgba(212,175,55,0.2)' }} />
                    {isSelected && (
                      <p className="text-[11px] font-semibold mt-3" style={{ color: '#d4c5f0' }}>
                        {ROLES[selectedIndex]?.split(' · ')[0]}
                      </p>
                    )}
                  </div>

                  {/* Card front (face-up after flip) */}
                  <div className="card-face card-back-face rounded-2xl p-4 flex flex-col gap-2"
                    style={{
                      background: 'linear-gradient(155deg, rgba(139,107,181,0.3) 0%, rgba(8,4,18,0.95) 100%)',
                      border: '1px solid rgba(177,156,217,0.5)',
                      boxShadow: '0 0 24px rgba(139,107,181,0.35), 0 8px 32px rgba(0,0,0,0.5)',
                    }}>

                    <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#b19cd9' }}>
                      {ROLES[selectedIndex] ?? ''}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" style={{ color: '#d4c5f0' }}>{card.symbol}</span>
                      <div>
                        <p className="text-sm font-bold text-ivory">{card.nameKo}</p>
                        <div className="flex gap-1 mt-0.5">
                          {card.keywords.slice(0, 2).map((kw) => (
                            <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(177,156,217,0.15)', color: '#b19cd9' }}>
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] leading-relaxed flex-1" style={{ color: '#9d96b0' }}>
                      {card.meaningUpright}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase: pick CTA */}
        {phase === 'pick' && (
          <div>
            {selected.length < PICK_COUNT ? (
              <p className="text-center text-xs mb-4" style={{ color: '#5e5870' }}>
                {selected.length === 0
                  ? '마음이 이끌리는 카드를 클릭하세요'
                  : `${PICK_COUNT - selected.length}장을 더 선택해주세요`}
              </p>
            ) : null}
            <button type="button" onClick={handleReveal}
              disabled={selected.length < PICK_COUNT}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
              style={{
                background: selected.length === PICK_COUNT
                  ? 'linear-gradient(135deg, #6b3fa0 0%, #9b6dd0 100%)'
                  : 'rgba(255,255,255,0.04)',
                color: selected.length === PICK_COUNT ? '#fff' : 'rgba(240,235,224,0.2)',
                boxShadow: selected.length === PICK_COUNT ? '0 4px 28px rgba(107,63,160,0.4)' : undefined,
              }}>
              {selected.length < PICK_COUNT
                ? `${PICK_COUNT - selected.length}장 더 선택`
                : '카드 열기 — 속마음 확인 →'}
            </button>
          </div>
        )}

        {/* Phase: loading */}
        {phase === 'reveal' && loading && (
          <div className="text-center py-4">
            <div className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-3"
              style={{ borderColor: 'rgba(177,156,217,0.5)', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: '#9d96b0' }}>카드를 해석하고 있어요...</p>
          </div>
        )}

        {/* Phase: done */}
        {phase === 'done' && (
          <div className="fade-up">
            <div className="text-center mb-4 py-3 rounded-xl"
              style={{ background: 'rgba(139,107,181,0.1)', border: '1px solid rgba(139,107,181,0.25)' }}>
              <p className="text-xs font-semibold" style={{ color: '#d4c5f0' }}>✦ 카드 해석이 완료됐어요</p>
            </div>
            <button type="button" onClick={handleNext}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #6b3fa0 0%, #9b6dd0 100%)',
                color: '#fff',
                boxShadow: '0 4px 28px rgba(107,63,160,0.4)',
              }}>
              속마음 결과 보기 →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CardsPage() {
  return <Suspense><CardsInner /></Suspense>;
}
