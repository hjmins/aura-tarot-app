'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Reading, PremiumResult } from '@/types';
import { getReading, updatePremiumResult } from '@/lib/firestore';
import { generatePremiumResult } from '@/lib/ai';
import ProbabilityBar from '@/components/ProbabilityBar';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-[10px] font-bold tracking-widest uppercase text-lavender/60 mb-3">{label}</p>
      {children}
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

        // 이미 premium result가 있으면 재사용
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
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block w-10 h-10 rounded-full border-2 animate-spin mb-4"
            style={{ borderColor: 'rgba(201,149,108,0.5)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm text-ivory/70">정밀 리포트를 생성하고 있어요...</p>
          <p className="text-xs text-ivory-dim/40 mt-1">잠시만 기다려주세요</p>
        </div>
      </main>
    );
  }

  if (error || !reading || !report) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-ivory/70 mb-4">{error || '리포트를 불러올 수 없어요.'}</p>
          <button onClick={() => router.push('/')} className="text-lavender text-sm underline">홈으로</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'rgba(201,149,108,0.15)', color: '#e0b48c' }}
        >
          ✦ 정밀 리포트
        </div>
        <h1 className="text-2xl font-extrabold text-ivory mb-1" style={{ letterSpacing: '-0.02em' }}>
          {reading.partnerName}님에 대한<br />AI 정밀 분석
        </h1>
        <p className="text-sm text-ivory-dim/70">{reading.userName}님만을 위한 리포트예요.</p>
      </div>

      <div className="space-y-4">
        {/* Overall summary */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(145deg, rgba(177,156,217,0.12), rgba(13,8,32,0.7))',
            border: '1px solid rgba(177,156,217,0.25)',
          }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-lavender/60 mb-3">전체 요약</p>
          <p className="text-sm text-ivory/90 leading-relaxed">{report.overallSummary}</p>
        </div>

        {/* Partner psychology */}
        <Section label="상대의 현재 심리">
          <p className="text-sm text-ivory/90 leading-relaxed">{report.partnerPsychology}</p>
        </Section>

        {/* Hidden emotions */}
        <Section label="숨기고 있는 감정">
          <p className="text-sm text-ivory/90 leading-relaxed">{report.hiddenEmotions}</p>
        </Section>

        {/* Probabilities */}
        <div
          className="rounded-2xl p-5 glass"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-lavender/60 mb-4">확률 분석</p>
          <div className="space-y-4">
            <ProbabilityBar label="연락 가능성" value={report.contactProbability} color="lavender" delay={0} />
            {report.reunionProbability > 0 && (
              <ProbabilityBar label="재회 가능성" value={report.reunionProbability} color="rose" delay={200} />
            )}
          </div>
        </div>

        {/* Next 2 weeks */}
        <Section label="앞으로 2주 흐름">
          <p className="text-sm text-ivory/90 leading-relaxed">{report.nextTwoWeeks}</p>
        </Section>

        {/* Things to avoid */}
        <Section label="피해야 할 행동">
          <ul className="space-y-2">
            {report.thingsToAvoid.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-ivory/80 leading-relaxed">
                <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] mt-0.5"
                  style={{ background: 'rgba(201,149,108,0.15)', color: '#e0b48c' }}>
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Recommended actions */}
        <Section label="추천 행동 3가지">
          <ul className="space-y-2">
            {report.recommendedActions.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-ivory/80 leading-relaxed">
                <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] mt-0.5"
                  style={{ background: 'rgba(177,156,217,0.15)', color: '#d4c5f0' }}>
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Final advice */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: 'linear-gradient(145deg, rgba(201,149,108,0.1), rgba(13,8,32,0.6))',
            border: '1px solid rgba(201,149,108,0.2)',
          }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-rose-gold/60 mb-3">마지막 조언</p>
          <p className="text-sm text-ivory/90 leading-relaxed">{report.finalAdvice}</p>
        </div>

        {/* PDF download (UI only) */}
        <button
          type="button"
          disabled
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(240,235,224,0.3)',
            cursor: 'not-allowed',
          }}
        >
          PDF 저장 (준비 중)
        </button>

        {/* Retry button */}
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
          style={{ background: 'rgba(177,156,217,0.1)', border: '1px solid rgba(177,156,217,0.2)', color: '#d4c5f0' }}
        >
          새로운 리딩 시작하기
        </button>
      </div>
    </main>
  );
}

export default function PremiumResultPage() {
  return (
    <Suspense>
      <PremiumInner />
    </Suspense>
  );
}
