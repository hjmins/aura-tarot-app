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

const ROLES = ['상대의 현재 감정', '망설이는 이유', '앞으로의 흐름'];

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

    // flip animation stagger
    for (let i = 0; i < selected.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
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
    <main className="min-h-screen px-4 py-12 max-w-lg mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs text-ivory-dim/60 hover:text-ivory-dim mb-8 transition-colors"
      >
        ← 뒤로
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-ivory mb-2" style={{ letterSpacing: '-0.02em' }}>
          {phase === 'pick' ? '마음이 이끄는 카드를 3장 선택하세요' : '카드가 말하고 있어요'}
        </h1>
        <p className="text-sm text-ivory-dim/70">
          {phase === 'pick'
            ? `${selected.length} / ${PICK_COUNT}장 선택됨`
            : '카드가 상대의 마음을 읽고 있어요...'}
        </p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {DISPLAY_CARDS.map((card, i) => {
          const isSelected = selected.includes(card.id);
          const isFlipped = flipped.includes(card.id);
          const selectedIndex = selected.indexOf(card.id);

          return (
            <div key={card.id} className="perspective">
              <div
                className={`card-inner ${isFlipped ? 'flipped' : ''}`}
                style={{ height: '160px' }}
              >
                {/* 앞면 */}
                <div
                  onClick={() => toggleCard(card.id)}
                  className={`
                    card-face rounded-2xl flex flex-col items-center justify-center cursor-pointer
                    transition-all duration-300 h-40
                    ${isSelected ? 'border border-lavender/60' : 'glass border-transparent hover:border-white/20'}
                  `}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(145deg, rgba(177,156,217,0.2), rgba(13,8,32,0.7))'
                      : 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(13,8,32,0.5))',
                    boxShadow: isSelected ? '0 0 0 1.5px rgba(177,156,217,0.5), 0 0 24px rgba(177,156,217,0.2)' : undefined,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                    style={{ background: 'rgba(177,156,217,0.1)', border: '1px solid rgba(177,156,217,0.2)' }}
                  >
                    <span className="text-lavender text-base">✦</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-lavender-light font-semibold">{selectedIndex + 1}번째</span>
                  )}
                </div>

                {/* 뒷면 */}
                <div
                  className="card-back-face rounded-2xl p-3 flex flex-col gap-1.5 border h-40"
                  style={{
                    background: 'linear-gradient(145deg, rgba(177,156,217,0.12), rgba(13,8,32,0.85))',
                    border: '1px solid rgba(177,156,217,0.3)',
                    boxShadow: '0 0 20px rgba(177,156,217,0.15)',
                  }}
                >
                  <p className="text-[9px] font-bold tracking-widest uppercase text-lavender/60">
                    {ROLES[selectedIndex] ?? ''}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl text-ivory/80">{card.symbol}</span>
                    <p className="text-xs font-bold text-ivory">{card.nameKo}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {card.keywords.slice(0, 2).map((kw) => (
                      <span
                        key={kw}
                        className="text-[9px] px-1.5 py-0.5 rounded-full text-lavender/70"
                        style={{ background: 'rgba(177,156,217,0.1)' }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-ivory-dim/70 leading-relaxed line-clamp-3 mt-auto">
                    {card.meaningUpright}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {phase === 'pick' && (
        <button
          type="button"
          onClick={handleReveal}
          disabled={selected.length < PICK_COUNT}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: selected.length === PICK_COUNT
              ? 'linear-gradient(135deg, #8b6bb5 0%, #b19cd9 100%)'
              : 'rgba(255,255,255,0.06)',
            color: selected.length === PICK_COUNT ? '#fff' : 'rgba(240,235,224,0.3)',
            boxShadow: selected.length === PICK_COUNT ? '0 0 24px rgba(177,156,217,0.3)' : undefined,
          }}
        >
          {selected.length < PICK_COUNT
            ? `${PICK_COUNT - selected.length}장 더 선택해주세요`
            : '카드 열기 →'}
        </button>
      )}

      {phase === 'reveal' && loading && (
        <div className="text-center">
          <div
            className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-3"
            style={{ borderColor: 'rgba(177,156,217,0.5)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm text-ivory-dim/70">카드를 해석하고 있어요...</p>
        </div>
      )}

      {phase === 'done' && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #8b6bb5 0%, #b19cd9 100%)',
            color: '#fff',
            boxShadow: '0 0 24px rgba(177,156,217,0.3)',
          }}
        >
          결과 확인하기 →
        </button>
      )}
    </main>
  );
}

export default function CardsPage() {
  return (
    <Suspense>
      <CardsInner />
    </Suspense>
  );
}
