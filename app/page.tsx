'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@/types';
import TarotHeroCards from '@/components/TarotHeroCards';

// ── Data ───────────────────────────────────────────────────────

const SERVICES: {
  type: ServiceType;
  icon: string;
  label: string;
  desc: string;
  badge?: string;
  accent: string;
  accentDim: string;
  accentBg: string;
  accentBorder: string;
}[] = [
  {
    type: 'love_mind',
    icon: '💜',
    label: '상대 속마음',
    desc: '차마 말하지 못한\n진짜 감정',
    accent: '#d4c5f0',
    accentDim: '#b19cd9',
    accentBg: 'rgba(139,107,181,0.18)',
    accentBorder: 'rgba(177,156,217,0.55)',
  },
  {
    type: 'contact_reunion',
    icon: '📩',
    label: '연락·재회 가능성',
    desc: '다시 이어질 수 있는\n흐름은 남아있을까',
    badge: '인기 1위',
    accent: '#d4c5f0',
    accentDim: '#9b6dd0',
    accentBg: 'rgba(107,63,160,0.2)',
    accentBorder: 'rgba(155,109,208,0.55)',
  },
  {
    type: 'money_business',
    icon: '💰',
    label: '금전·사업운',
    desc: '지금 선택이 돈의\n흐름을 바꿀까',
    accent: '#e0b48c',
    accentDim: '#c9956c',
    accentBg: 'rgba(201,149,108,0.16)',
    accentBorder: 'rgba(201,149,108,0.5)',
  },
  {
    type: 'choice_tarot',
    icon: '⚖️',
    label: '선택 타로',
    desc: '망설이는 두 방향 중\n더 맞는 길',
    accent: '#c8c0d8',
    accentDim: '#9d96b0',
    accentBg: 'rgba(157,150,176,0.14)',
    accentBorder: 'rgba(157,150,176,0.45)',
  },
];

const STEPS = [
  { num: '01', icon: '◎', title: '상황 입력', desc: '지금의 상황과 고민을\n조금만 적어주세요.' },
  { num: '02', icon: '✦', title: '카드 선택', desc: '직감으로 3장의 카드를\n선택해주세요.' },
  { num: '03', icon: '◯', title: '무료 리딩', desc: '카드가 전하는 메시지를\n무료로 확인할 수 있어요.' },
  { num: '04', icon: '☽', title: '정밀 리딩', desc: '더 깊이 알고 싶을 때만\n정밀 리딩을 열어보세요.' },
];

const LOCKED_PREVIEW = [
  '상대가 후회하고 있는 감정 지점',
  '다시 연락이 들어올 가능 시기',
  '먼저 연락하면 안 되는 이유',
  '재회 흐름이 살아나는 조건',
  '지금 놓치고 있는 감정 신호',
];

const REVIEWS = [
  { text: '읽씹한 이유를 보고 마음이 정리됐어요. 이상하게 위로가 됐어요.', author: '20대 · 직장인', stars: 5 },
  { text: '소름돋게 맞아서 결국 재회 리포트도 열어봤어요. 진짜 신기함.', author: '30대 · 대학생', stars: 5 },
  { text: '연락 타이밍 문구가 너무 현실적이라 놀랐어요. 친구들한테도 알려줬어요.', author: '20대 · 프리랜서', stars: 5 },
];

const WHY_ITEMS = [
  { icon: '✦', title: '타로가 전하는 상징과 메시지', desc: '카드 고유의 상징을 통해 지금 흐르는 감정의 방향을 읽어냅니다.' },
  { icon: '◎', title: '상황과 감정을 깊이 해석', desc: '적어주신 상황과 감정을 바탕으로 놓치고 있는 신호를 짚어드립니다.' },
  { icon: '◯', title: '관계의 흐름과 가능성 제시', desc: '지금 이후의 변화와 가능성, 방향까지 구체적으로 안내해드립니다.' },
];

const NAV_LINKS = [
  { label: '리딩 받기', href: '#service-select' },
  { label: '이용 안내', href: '#how-it-works' },
  { label: '리딩 후기', href: '#reviews' },
];

// ── Component ──────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState<ServiceType | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState(1284);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => Math.max(1270, Math.min(1300, c + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleStart = () => {
    if (!selected) return;
    router.push(`/reading?service=${encodeURIComponent(selected)}`);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-bg min-h-screen">

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 px-4 py-3 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8,4,18,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : undefined,
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : undefined,
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div>
            <p className="text-sm font-black tracking-widest" style={{ color: '#f0ebe0', letterSpacing: '0.1em' }}>
              AURA TAROT
            </p>
            <p className="text-[9px] font-medium tracking-[0.14em]" style={{ color: '#5e5870' }}>
              속마음 리딩 상담소
            </p>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <button key={l.label} onClick={() => scrollTo(l.href)}
                className="text-xs font-medium transition-colors hover:text-ivory"
                style={{ color: '#9d96b0' }}>
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#service-select')}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #6b3fa0, #9b6dd0)',
                color: '#fff',
                boxShadow: '0 2px 14px rgba(107,63,160,0.35)',
              }}>
              리딩 받기
            </button>
          </div>

          {/* Mobile CTA */}
          <button
            className="md:hidden px-3 py-1.5 rounded-full text-xs font-bold"
            onClick={() => scrollTo('#service-select')}
            style={{
              background: 'rgba(107,63,160,0.3)',
              border: '1px solid rgba(139,107,181,0.45)',
              color: '#d4c5f0',
            }}>
            리딩 받기
          </button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="px-4 pt-10 pb-6 max-w-lg mx-auto text-center">

        {/* Badge */}
        <div className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(139,107,181,0.15)', border: '1px solid rgba(139,107,181,0.3)', color: '#d4c5f0' }}>
          ✨ &nbsp;누적 12,482건의 속마음 리딩 완료
        </div>

        {/* Headline */}
        <h1 className="fade-up-2 font-extrabold leading-[1.18] mb-5"
          style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', letterSpacing: '-0.03em', color: '#f0ebe0' }}>
          그 사람은 아직<br />
          <span style={{
            background: 'linear-gradient(135deg, #d4c5f0 0%, #b19cd9 45%, #9b6dd0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>당신을 완전히</span><br />
          놓지 못했습니다
        </h1>

        <p className="fade-up-3 text-sm leading-relaxed mb-5 mx-auto max-w-xs"
          style={{ color: '#9d96b0' }}>
          읽지 못한 그 사람의 진짜 마음,<br />
          카드가 보여주는 감정의 흐름을 확인해보세요.
        </p>

        {/* Social proof */}
        <div className="fade-up-4 inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full text-xs font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9d96b0' }}>
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          최근 24시간&nbsp;
          <span className="font-bold tabular-nums" style={{ color: '#f0ebe0' }}>{count.toLocaleString()}명</span>
          &nbsp;이 속마음 리딩을 확인했습니다
        </div>

        {/* Hero cards */}
        <TarotHeroCards />
      </section>

      {/* ── SERVICE SELECTION ─────────────────────────────────── */}
      <section id="service-select" className="px-4 pt-10 pb-10 max-w-lg mx-auto">

        <div className="text-center mb-6">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#5e5870' }}>
            어떤 답이 필요하신가요
          </p>
          <h2 className="text-xl font-extrabold text-ivory" style={{ letterSpacing: '-0.02em' }}>
            지금 가장 궁금한 고민을 선택하세요
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {SERVICES.map((s) => {
            const active = selected === s.type;
            return (
              <button
                key={s.type}
                type="button"
                onClick={() => setSelected(s.type)}
                className="relative text-left p-5 rounded-2xl transition-all duration-200 active:scale-95"
                style={{
                  background: active ? s.accentBg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? s.accentBorder : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: active ? `0 0 28px ${s.accentBg}, 0 0 0 1px ${s.accentBorder}` : undefined,
                  transform: active ? 'scale(1.02)' : undefined,
                  minHeight: '168px',
                }}>

                {/* Popular badge */}
                {s.badge && (
                  <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #6b3fa0, #9b6dd0)',
                      color: '#fff',
                      boxShadow: '0 2px 10px rgba(107,63,160,0.4)',
                    }}>
                    {s.badge}
                  </div>
                )}

                <span className="text-3xl block mb-3">{s.icon}</span>
                <p className="text-sm font-bold mb-2 leading-tight"
                  style={{ color: active ? s.accent : '#f0ebe0' }}>
                  {s.label}
                </p>
                <p className="text-[11px] leading-snug whitespace-pre-line"
                  style={{ color: active ? s.accentDim : '#5e5870' }}>
                  {s.desc}
                </p>

                {active && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.accent }} />
                    <span className="text-[10px] font-bold" style={{ color: s.accentDim }}>선택됨</span>
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
          무료 리딩 후 원할 때만 정밀 결과를 열어보세요
        </p>
      </section>

      <div className="section-divider" />

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="px-4 py-14 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#5e5870' }}>
            Process
          </p>
          <h2 className="text-xl font-extrabold text-ivory mb-1" style={{ letterSpacing: '-0.02em' }}>
            리딩은 이렇게 진행돼요
          </h2>
          <p className="text-xs" style={{ color: '#9d96b0' }}>처음이라도 걱정 없어요 — 단 3분이면 충분해요</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {STEPS.map((step) => (
            <div key={step.num} className="rounded-2xl p-5"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-black tabular-nums" style={{ color: '#3e3850' }}>
                  {step.num}
                </span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ color: '#7c6bad', fontSize: '13px' }}>{step.icon}</span>
              </div>
              <p className="text-sm font-bold text-ivory mb-1.5">{step.title}</p>
              <p className="text-[11px] leading-snug whitespace-pre-line" style={{ color: '#5e5870' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── PREMIUM PREVIEW ───────────────────────────────────── */}
      <section className="px-4 py-14 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#5e5870' }}>
            Premium Reading
          </p>
          <h2 className="text-xl font-extrabold text-ivory mb-1" style={{ letterSpacing: '-0.02em' }}>
            정밀 리딩에서는 이런 내용을<br />확인합니다
          </h2>
        </div>

        {/* Blurred list */}
        <div className="relative rounded-2xl overflow-hidden mb-4"
          style={{ border: '1px solid rgba(177,156,217,0.15)' }}>
          {LOCKED_PREVIEW.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 transition-all"
              style={{
                borderBottom: i < LOCKED_PREVIEW.length - 1 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                background: i === 0 ? 'rgba(139,107,181,0.07)' : undefined,
                filter: i >= 2 ? `blur(${(i - 1) * 1.5}px)` : undefined,
                opacity: i >= 3 ? 0.5 : 1,
              }}>
              <span style={{ color: '#7c6bad', fontSize: '14px', flexShrink: 0 }}>✦</span>
              <p className="text-sm" style={{ color: i === 0 ? '#d4c5f0' : '#9d96b0' }}>{item}</p>
              {i >= 2 && (
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: 'rgba(107,63,160,0.2)', color: '#9b6dd0' }}>
                  🔒
                </span>
              )}
            </div>
          ))}

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, #080412 100%)' }} />
        </div>

        {/* Lock box */}
        <div className="rounded-2xl px-5 py-4 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '18px' }}>🔒</span>
          <p className="text-sm font-semibold text-ivory mt-2 mb-1">
            이 모든 내용은 정밀 리딩에서 확인할 수 있습니다.
          </p>
          <p className="text-xs" style={{ color: '#5e5870' }}>
            무료 리딩 후, 원할 때만 열어보세요
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── REVIEWS ───────────────────────────────────────────── */}
      <section id="reviews" className="px-4 py-14 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#5e5870' }}>
            Real Reviews
          </p>
          <h2 className="text-xl font-extrabold text-ivory" style={{ letterSpacing: '-0.02em' }}>
            실제 리딩 후기
          </h2>
        </div>

        <div className="space-y-3">
          {REVIEWS.map((r, i) => (
            <div key={i} className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: r.stars }).map((_, si) => (
                  <span key={si} style={{ color: '#d4af37', fontSize: '13px' }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#d4c5f0' }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="text-[11px]" style={{ color: '#5e5870' }}>{r.author}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── WHY ACCURATE ──────────────────────────────────────── */}
      <section className="px-4 py-14 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#5e5870' }}>
            Why It Works
          </p>
          <h2 className="text-xl font-extrabold text-ivory mb-2" style={{ letterSpacing: '-0.02em' }}>
            왜 이렇게 잘 맞을까요?
          </h2>
          <p className="text-xs" style={{ color: '#9d96b0' }}>단순한 운세가 아닌, 감정의 흐름을 읽는 리딩</p>
        </div>

        <div className="space-y-3">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="rounded-2xl p-5 flex items-start gap-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(139,107,181,0.14)', border: '1px solid rgba(139,107,181,0.25)' }}>
                <span style={{ color: '#b19cd9', fontSize: '15px' }}>{item.icon}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-ivory mb-1">{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#9d96b0' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="px-4 pt-4 pb-16 max-w-lg mx-auto">
        <div className="relative rounded-3xl overflow-hidden text-center"
          style={{
            background: 'linear-gradient(145deg, rgba(107,63,160,0.28) 0%, rgba(8,4,18,0.92) 100%)',
            border: '1px solid rgba(177,156,217,0.25)',
            boxShadow: '0 0 60px rgba(107,63,160,0.18)',
            padding: '40px 24px',
          }}>

          {/* Background glow */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            width: '260px',
            height: '180px',
            marginLeft: '-130px',
            background: 'radial-gradient(ellipse, rgba(139,107,181,0.2) 0%, transparent 70%)',
            filter: 'blur(24px)',
            pointerEvents: 'none',
          }} />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(139,107,181,0.2)', border: '1px solid rgba(177,156,217,0.3)' }}>
              <span style={{ color: '#d4c5f0', fontSize: '20px' }}>✦</span>
            </div>

            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: '#7c6bad' }}>
              Premium Reading
            </p>

            <h2 className="text-xl font-extrabold text-ivory mb-3" style={{ letterSpacing: '-0.02em', lineHeight: 1.4 }}>
              지금 이 순간, 카드가<br />당신에게 말하고 있어요.
            </h2>

            <p className="text-sm mb-8 mx-auto max-w-xs leading-relaxed" style={{ color: '#9d96b0' }}>
              그 사람의 진짜 마음을 더 깊이 읽어보세요.
            </p>

            <button
              type="button"
              onClick={handleStart}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] mb-2"
              style={{
                background: 'linear-gradient(135deg, #c9956c 0%, #e0b48c 100%)',
                color: '#1a0a2e',
                boxShadow: '0 4px 28px rgba(201,149,108,0.45)',
              }}>
              {selected
                ? `${SERVICES.find((s) => s.type === selected)?.label} 리딩 시작하기 →`
                : '정밀 속마음 리딩 열기 — 4,900원'}
            </button>

            <p className="text-[11px]" style={{ color: '#5e5870' }}>오늘 첫 리딩 할인 적용</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="px-4 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#5e5870', letterSpacing: '0.12em' }}>
          AURA TAROT
        </p>
        <p className="text-[11px]" style={{ color: '#3e3850' }}>
          © 2026 Aura · 리딩 결과는 감정 흐름 분석을 기반으로 하며 참고 목적입니다.
        </p>
      </footer>
    </div>
  );
}
