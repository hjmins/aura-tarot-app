'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Reading, PremiumResult } from '@/types';
import { getReading, updatePremiumResult } from '@/lib/firestore';
import { generatePremiumResult } from '@/lib/ai';
import ProbabilityBar from '@/components/ProbabilityBar';

function AnalysisCard({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-sm" style={{ color: '#b19cd9' }}>{icon}</span>
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: '#7c6bad' }}>{label}</p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function PremiumInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id') ?? '';
  const isMock = params.get('mock') === 'true';
  const sessionId = params.get('session_id');

  const [reading, setReading] = useState<Reading | null>(null);
  const [report, setReport] = useState<PremiumResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
        let r: Reading | null = null;

        if (useMock || isMock) {
          const raw = sessionStorage.getItem(id);
          if (raw) r = { ...JSON.parse(raw), id };
        } else {
          r = await getReading(id);
          if (!r?.paid && !sessionId) {
            setError('결제가 확인되지 않았어요.');
            setLoading(false);
            return;
          }
        }

        if (!r) {
          setError('리딩 정보를 찾을 수 없어요.');
          setLoading(false);
          return;
        }

        setReading(r);

        if (r.premiumResult) {
          setReport(r.premiumResult);
          setLoading(false);
          return;
        }

        const premium = await generatePremiumResult(r);
        setReport(premium);

        if (!useMock && !isMock) {
          await updatePremiumResult(id, premium);
        } else {
          const stored = JSON.parse(sessionStorage.getItem(id) ?? '{}');
          sessionStorage.setItem(id, JSON.stringify({ ...stored, premiumResult: premium, paid: true }));
        }
      } catch (e) {
        console.error(e);
        setError('리포트 생성 중 오류가 발생했어요.');
      }
      setLoading(false);
    };
    if (id) load();
  }, [id, isMock, sessionId]);

  if (loading) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="inline-block w-12 h-12 rounded-full border-2 animate-spin mb-5"
            style={{ borderColor: 'rgba(201,149,108,0.4)', borderTopColor: '#e0b48c' }} />
          <p className="text-base font-bold text-ivory mb-1">정밀 리포트를 생성하고 있어요</p>
          <p className="text-sm" style={{ color: '#9d96b0' }}>AI가 카드와 관계 패턴을 분석 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !reading || !report) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-sm" style={{ color: '#9d96b0' }}>{error || '리포트를 불러올 수 없어요.'}</p>
          <button onClick={() => router.push('/')} className="text-sm underline" style={{ color: '#b19cd9' }}>
            홈으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen">
      <main className="px-4 py-10 max-w-lg mx-auto">

        {/* Premium header badge */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: 'rgba(201,149,108,0.15)', border: '1px solid rgba(201,149,108,0.35)', color: '#e0b48c' }}>
            ✦ 정밀 AI 분석 리포트
          </div>
          <h1 className="text-2xl font-extrabold text-ivory mb-2" style={{ letterSpacing: '-0.025em' }}>
            {reading.partnerName}님에 대한<br />AI 정밀 분석
          </h1>
          <p className="text-sm" style={{ color: '#9d96b0' }}>
            {reading.userName}님만을 위해 생성된 리포트예요.
          </p>
        </div>

        <div className="space-y-4">

          {/* 1. Overall summary */}
          <div className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(145deg, rgba(177,156,217,0.12), rgba(8,4,18,0.8))',
              border: '1px solid rgba(177,156,217,0.3)',
              boxShadow: '0 0 32px rgba(139,107,181,0.15)',
            }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: '#b19cd9', fontSize: '16px' }}>◎</span>
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: '#7c6bad' }}>
                전체 요약
              </p>
            </div>
            <p className="text-sm leading-relaxed text-ivory">{report.overallSummary}</p>
          </div>

          {/* 2. Partner psychology */}
          <AnalysisCard label="상대의 현재 심리" icon="◯">
            <p className="text-sm leading-relaxed" style={{ color: '#d4c5f0' }}>{report.partnerPsychology}</p>
          </AnalysisCard>

          {/* 3. Hidden emotions */}
          <AnalysisCard label="숨기고 있는 감정" icon="☽">
            <p className="text-sm leading-relaxed" style={{ color: '#d4c5f0' }}>{report.hiddenEmotions}</p>
          </AnalysisCard>

          {/* 4. Probability analysis */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,149,108,0.2)' }}>
            <div className="flex items-center gap-2.5 px-5 py-3.5"
              style={{ background: 'rgba(201,149,108,0.06)', borderBottom: '1px solid rgba(201,149,108,0.15)' }}>
              <span style={{ color: '#e0b48c', fontSize: '14px' }}>✦</span>
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: '#c9956c' }}>
                확률 수치 분석
              </p>
            </div>
            <div className="px-5 py-5 space-y-5">
              <ProbabilityBar label="연락 가능성" value={report.contactProbability} color="lavender" delay={0} />
              {report.reunionProbability > 0 && (
                <ProbabilityBar label="재회 가능성" value={report.reunionProbability} color="rose" delay={200} />
              )}
              <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-[11px] leading-relaxed" style={{ color: '#5e5870' }}>
                  * 수치는 카드 조합과 현재 관계 맥락을 바탕으로 AI가 산출한 심리 예측값입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Next 2 weeks */}
          <AnalysisCard label="앞으로 2주 감정 흐름 예측" icon="◇">
            <p className="text-sm leading-relaxed" style={{ color: '#d4c5f0' }}>{report.nextTwoWeeks}</p>
          </AnalysisCard>

          {/* 6. Things to avoid */}
          <AnalysisCard label="절대 피해야 할 행동 4가지" icon="⊕">
            <ul className="space-y-3">
              {report.thingsToAvoid.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{ background: 'rgba(201,149,108,0.15)', color: '#e0b48c', border: '1px solid rgba(201,149,108,0.2)' }}>
                    {i + 1}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#d4c5f0' }}>{item}</p>
                </li>
              ))}
            </ul>
          </AnalysisCard>

          {/* 7. Recommended actions */}
          <AnalysisCard label="지금 추천 행동 3가지" icon="✦">
            <ul className="space-y-3">
              {report.recommendedActions.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{ background: 'rgba(139,107,181,0.2)', color: '#d4c5f0', border: '1px solid rgba(177,156,217,0.25)' }}>
                    {i + 1}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#d4c5f0' }}>{item}</p>
                </li>
              ))}
            </ul>
          </AnalysisCard>

          {/* 8. Optimal timing */}
          {'optimalContactTiming' in report && (report as { optimalContactTiming?: string }).optimalContactTiming && (
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase mb-2" style={{ color: '#d4af37' }}>
                ✦ 먼저 연락하기 최적 타이밍
              </p>
              <p className="text-sm leading-relaxed text-ivory">
                {(report as { optimalContactTiming?: string }).optimalContactTiming}
              </p>
            </div>
          )}

          {/* 9. Final advice */}
          <div className="rounded-2xl p-6 text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(201,149,108,0.1), rgba(8,4,18,0.8))',
              border: '1px solid rgba(201,149,108,0.3)',
              boxShadow: '0 0 32px rgba(201,149,108,0.1)',
            }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(201,149,108,0.15)', border: '1px solid rgba(201,149,108,0.25)' }}>
              <span style={{ color: '#e0b48c', fontSize: '16px' }}>✦</span>
            </div>
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase mb-3" style={{ color: '#c9956c' }}>
              나만을 위한 마지막 조언
            </p>
            <p className="text-sm leading-relaxed text-ivory">{report.finalAdvice}</p>
          </div>

          {/* PDF download (UI) */}
          <button type="button" disabled
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(240,235,224,0.3)',
              cursor: 'not-allowed',
            }}>
            <span>↓</span> PDF 저장 (준비 중)
          </button>

          {/* Divider */}
          <div className="py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* New reading */}
          <button type="button" onClick={() => router.push('/')}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #6b3fa0 0%, #9b6dd0 100%)',
              color: '#fff',
              boxShadow: '0 4px 28px rgba(107,63,160,0.35)',
            }}>
            새로운 리딩 시작하기 →
          </button>

          <p className="text-center text-[11px]" style={{ color: '#3e3850' }}>
            © 2026 Aura · 리딩 결과는 심리 분석 기반의 참고 목적입니다.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function PremiumResultPage() {
  return <Suspense><PremiumInner /></Suspense>;
}
