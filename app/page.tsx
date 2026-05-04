'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@/types';

const SERVICES: {
  type: ServiceType;
  icon: string;
  label: string;
  desc: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}[] = [
  {
    type: 'love_mind',
    icon: '💜',
    label: '상대 속마음',
    desc: '그 사람이 숨기고 있는\n진짜 감정',
    accent: '#d4c5f0',
    accentBg: 'rgba(139,107,181,0.18)',
    accentBorder: 'rgba(177,156,217,0.5)',
  },
  {
    type: 'contact_reunion',
    icon: '📩',
    label: '연락·재회 가능성',
    desc: '다시 연락이 올\n타이밍과 흐름',
    accent: '#b19cd9',
    accentBg: 'rgba(107,63,160,0.15)',
    accentBorder: 'rgba(139,107,181,0.45)',
  },
  {
    type: 'money_business',
    icon: '💰',
    label: '금전·사업운',
    desc: '이번 달 돈과\n기회의 흐름',
    accent: '#e0b48c',
    accentBg: 'rgba(201,149,108,0.15)',
    accentBorder: 'rgba(201,149,108,0.45)',
  },
  {
    type: 'choice_tarot',
    icon: '⚖️',
    label: '선택 타로',
    desc: 'A와 B 사이,\n지금 더 좋은 선택',
    accent: '#9d96b0',
    accentBg: 'rgba(157,150,176,0.12)',
    accentBorder: 'rgba(157,150,176,0.4)',
  },
];

const REVIEWS = [
  { text: '"소름돋게 맞아서 다시 결제했어요. 상대 심리가 너무 정확해서 ㄷㄷ"', name: '20대 / 서울', ago: '2시간 전' },
  { text: '"읽씹한 이유를 보고 마음이 정리됐어요. 이상하게 위로가 됐어요."', name: '30대 / 경기', ago: '5시간 전' },
  { text: '"재회 가능성 타이밍이 너무 정확했어요. 그날 진짜 연락 왔음 ㅠㅠ"', name: '20대 / 부산', ago: '1일 전' },
  { text: '"전 남친 심리 분석이 실제랑 너무 똑같아서 소름. 친구한테 공유했어요"', name: '20대 / 인천', ago: '3일 전' },
];

const WHY_ITEMS = [
  { icon: '◎', title: 'AI 감정 패턴 분석', desc: '수천 건의 관계 데이터를 학습한 AI가 감정의 흐름과 패턴을 분석합니다.' },
  { icon: '✦', title: '타로 카드 상징 해석', desc: '78장 타로 카드의 상징 체계와 포지션 의미를 정밀하게 조합합니다.' },
  { icon: '◯', title: '관계 흐름 심리 매칭', desc: '현재 관계 상태와 심리적 맥락을 연결해 맞춤 해석을 도출합니다.' },
];

function HeroCard({ delay }: { delay: string }) {
  return (
    <div className="relative rounded-2xl flex flex-col items-center justify-center"
      style={{
        width: '90px', height: '135px',
        background: 'linear-gradient(155deg, rgba(139,107,181,0.15) 0%, rgba(8,4,18,0.9) 100%)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
        animationDelay: delay,
      }}>
      <div style={{
        position: 'absolute', inset: -1, borderRadius: 'inherit',
        background: 'linear-gradient(135deg, rgba(212,175,55,0.4), rgba(139,107,181,0.3), rgba(212,175,55,0.2))',
        zIndex: -1,
      }} />
      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
        style={{ background: 'rgba(177,156,217,0.12)', border: '1px solid rgba(177,156,217,0.25)' }}>
        <span className="text-lavender text-sm">✦</span>
      </div>
      <div className="w-5 h-px mb-1" style={{ background: 'rgba(212,175,55,0.4)' }} />
      <div className="w-3 h-px" style={{ background: 'rgba(212,175,55,0.25)' }} />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState<ServiceType | null>(null);
  const [count, setCount] = useState(134);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(120, Math.min(160, c + delta));
      });
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleStart = () => {
    if (!selected) return;
    router.push(`/reading?service=${encodeURIComponent(selected)}`);
  };

  return (
    <div className="page-bg min-h-screen">

      {/* ── HERO ── */}
      <section className="px-4 pt-12 pb-0 max-w-lg mx-auto text-center">

        {/* Social proof badge */}
        <div className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(139,107,181,0.15)', border: '1px solid rgba(139,107,181,0.3)', color: '#d4c5f0' }}>
          ✨ &nbsp;누적 12,482건의 속마음 리딩 완료
        </div>

        {/* Headline */}
        <h1 className="fade-up-2 font-extrabold leading-[1.18] mb-4"
          style={{ fontSize: 'clamp(1.8rem, 7vw, 2.6rem)', letterSpacing: '-0.03em', color: '#f0ebe0' }}>
          당신이 모르는<br />
          <span style={{
            background: 'linear-gradient(135deg, #d4c5f0 0%, #b19cd9 50%, #9b6dd0 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            그 사람의 진짜 속마음
          </span>
        </h1>

        <p className="fade-up-3 text-sm leading-relaxed mb-5 mx-auto max-w-xs"
          style={{ color: '#9d96b0' }}>
          읽씹, 잠수, 이별 뒤에도 남아있는<br />감정의 신호를 AI 타로로 정밀 분석합니다.
        </p>

        {/* Live counter */}
        <div className="fade-up-4 inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9d96b0' }}>
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          최근 1시간 내 <span className="text-ivory font-bold mx-1">{count}명</span>이 리딩을 시작했어요
        </div>

        {/* Floating hero cards */}
        <div className="flex items-end justify-center gap-3 mb-10" style={{ height: '160px' }}>
          <div className="float-left" style={{ marginBottom: '10px' }}>
            <HeroCard delay="0s" />
          </div>
          <div className="float-center" style={{ marginBottom: '0px' }}>
            <div style={{ transform: 'scale(1.1)' }}>
              <HeroCard delay="0.8s" />
            </div>
          </div>
          <div className="float-right" style={{ marginBottom: '10px' }}>
            <HeroCard delay="1.6s" />
          </div>
        </div>
      </section>

      {/* ── SERVICE SELECTION ── */}
      <section className="px-4 pb-10 max-w-lg mx-auto">

        <p className="text-center text-[11px] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: '#5e5870' }}>
          어떤 답이 필요하신가요?
        </p>

        {/* 2×2 service grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {SERVICES.map((s) => {
            const active = selected === s.type;
            return (
              <button
                key={s.type}
                type="button"
                onClick={() => setSelected(s.type)}
                className="text-left p-5 rounded-2xl transition-all duration-200 active:scale-95"
                style={{
                  background: active ? s.accentBg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? s.accentBorder : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: active
                    ? `0 0 28px ${s.accentBg}, 0 0 0 1px ${s.accentBorder}`
                    : undefined,
                  transform: active ? 'scale(1.02)' : undefined,
                }}>
                <span className="text-2xl block mb-3">{s.icon}</span>
                <p className="text-sm font-bold mb-1.5 leading-tight"
                  style={{ color: active ? s.accent : '#f0ebe0' }}>
                  {s.label}
                </p>
                <p className="text-[11px] leading-snug whitespace-pre-line"
                  style={{ color: active ? s.accent + 'cc' : '#5e5870' }}>
                  {s.desc}
                </p>
                {active && (
                  <div className="mt-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.accent }} />
                    <span className="text-[10px] font-bold" style={{ color: s.accent }}>선택됨</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Main CTA */}
        <button
          type="button"
          onClick={handleStart}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
          style={{
            background: selected
              ? 'linear-gradient(135deg, #6b3fa0 0%, #9b6dd0 100%)'
              : 'rgba(255,255,255,0.05)',
            color: selected ? '#fff' : 'rgba(240,235,224,0.2)',
            boxShadow: selected ? '0 4px 32px rgba(107,63,160,0.5)' : undefined,
            transform: selected ? 'scale(1.01)' : undefined,
          }}>
          3장의 카드로 지금 확인하기 →
        </button>

        <p className="text-center text-[11px] mt-3" style={{ color: '#5e5870' }}>
          무료 리딩 후, 원할 때만 정밀 리포트를 열어보세요.
        </p>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-4 py-12 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: '#5e5870' }}>
            Real Reviews
          </p>
          <h2 className="text-xl font-extrabold text-ivory" style={{ letterSpacing: '-0.025em' }}>
            실제 이용자 후기
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {REVIEWS.map((r, i) => (
            <div key={i} className="glass rounded-2xl p-4 flex flex-col gap-2">
              <p className="text-sm leading-relaxed" style={{ color: '#d4c5f0' }}>{r.text}</p>
              <div className="flex items-center justify-between">
                <p className="text-[11px]" style={{ color: '#5e5870' }}>{r.name}</p>
                <p className="text-[11px]" style={{ color: '#5e5870' }}>{r.ago}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ACCURATE ── */}
      <section className="px-4 py-12 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: '#5e5870' }}>
            Why It Works
          </p>
          <h2 className="text-xl font-extrabold text-ivory mb-2" style={{ letterSpacing: '-0.025em' }}>
            AI + 타로 + 관계심리 패턴을<br />함께 분석합니다
          </h2>
          <p className="text-xs" style={{ color: '#9d96b0' }}>단순 운세가 아닌 심리 기반 정밀 분석</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="glass rounded-2xl p-4 flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(139,107,181,0.15)', border: '1px solid rgba(139,107,181,0.25)' }}>
                <span className="text-lavender text-base">{item.icon}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-ivory mb-1">{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#9d96b0' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PREMIUM PREVIEW ── */}
      <section className="px-4 py-12 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: '#5e5870' }}>
            Premium Report
          </p>
          <h2 className="text-xl font-extrabold text-ivory mb-2" style={{ letterSpacing: '-0.025em' }}>
            정밀 리포트에서 확인할 수 있어요
          </h2>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(201,149,108,0.25)' }}>
          <div className="p-4" style={{ background: 'rgba(201,149,108,0.06)' }}>
            <p className="text-xs font-bold" style={{ color: '#e0b48c' }}>✦ 정밀 AI 분석 리포트 포함 항목</p>
          </div>
          {[
            '상대가 당신을 그리워하는 정도 분석',
            '실제 연락이 올 가능성 (수치 포함)',
            '먼저 연락해도 되는 시기 판단',
            '재회 가능성 % 수치 분석',
            '절대 피해야 할 행동 4가지',
            '앞으로 2주 감정 흐름 예측',
            '추천 행동 3가지',
            '나만을 위한 마지막 조언',
          ].map((item, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[11px]" style={{ color: '#e0b48c' }}>✓</span>
              <p className="text-xs" style={{ color: '#9d96b0' }}>{item}</p>
            </div>
          ))}
          <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #c9956c 0%, #e0b48c 100%)',
                color: '#1a0a2e',
                boxShadow: '0 4px 24px rgba(201,149,108,0.4)',
              }}>
              지금 무료로 시작하기 →
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-4 py-8 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-xs mb-1 font-bold" style={{ color: '#5e5870' }}>Aura</p>
        <p className="text-[11px]" style={{ color: '#3e3850' }}>
          © 2026 Aura. 리딩 결과는 심리 분석을 기반으로 하며 참고 목적입니다.
        </p>
      </footer>
    </div>
  );
}
