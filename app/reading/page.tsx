'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceType, RelationshipStatus } from '@/types';
import { createReading } from '@/lib/firestore';

const STATUSES: RelationshipStatus[] = ['썸', '연애중', '헤어짐', '읽씹/잠수', '짝사랑'];

const STATUS_LABELS: Record<RelationshipStatus, string> = {
  '썸': '썸 / 썸타는 중',
  '연애중': '연애 중',
  '헤어짐': '헤어진 사이',
  '읽씹/잠수': '읽씹 / 잠수',
  '짝사랑': '짝사랑',
};

function ReadingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const serviceType = (params.get('service') ?? '상대 속마음 보기') as ServiceType;

  const [form, setForm] = useState({
    userName: '',
    partnerName: '',
    relationshipStatus: '' as RelationshipStatus | '',
    question: '',
    birthDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = form.userName.trim() && form.partnerName.trim() && form.relationshipStatus;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
      let id: string;
      if (useMock) {
        id = 'mock-' + Date.now();
        sessionStorage.setItem(id, JSON.stringify({
          ...form, serviceType, paid: false, createdAt: new Date().toISOString(),
        }));
      } else {
        id = await createReading({
          serviceType,
          userName: form.userName,
          partnerName: form.partnerName,
          relationshipStatus: form.relationshipStatus as RelationshipStatus,
          question: form.question,
          birthDate: form.birthDate || undefined,
          paid: false,
        });
      }
      router.push(`/cards?id=${id}`);
    } catch (err) {
      console.error(err);
      setError('오류가 발생했어요. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  const inputBase = `
    w-full px-4 py-3.5 rounded-xl text-sm text-ivory
    placeholder:text-ivory-faint outline-none transition-all input-glow
  `;
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
  };

  return (
    <div className="page-bg min-h-screen">
      <main className="px-4 py-10 max-w-lg mx-auto">

        {/* Back */}
        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs mb-8 transition-colors hover:text-ivory"
          style={{ color: '#5e5870' }}>
          ← 뒤로
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(139,107,181,0.15)', border: '1px solid rgba(139,107,181,0.3)', color: '#d4c5f0' }}>
            {serviceType}
          </div>
          <h1 className="text-2xl font-extrabold text-ivory mb-1.5" style={{ letterSpacing: '-0.025em' }}>
            정확한 리딩을 위해<br />현재 상황을 알려주세요
          </h1>
          <p className="text-sm" style={{ color: '#9d96b0' }}>
            입력하신 정보는 카드 해석의 정밀도를 높이는 데 사용됩니다.
          </p>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-xs">🔒</span>
          <p className="text-[11px]" style={{ color: '#5e5870' }}>
            입력 정보는 외부에 저장되지 않으며 리딩 목적으로만 사용됩니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9d96b0' }}>내 이름</label>
              <input className={inputBase} style={inputStyle} placeholder="예) 지수"
                value={form.userName} onChange={(e) => setForm((f) => ({ ...f, userName: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9d96b0' }}>상대 이름</label>
              <input className={inputBase} style={inputStyle} placeholder="예) 민준"
                value={form.partnerName} onChange={(e) => setForm((f) => ({ ...f, partnerName: e.target.value }))} required />
            </div>
          </div>

          {/* Relationship status */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#9d96b0' }}>현재 관계 상태</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => {
                const active = form.relationshipStatus === s;
                return (
                  <button key={s} type="button"
                    onClick={() => setForm((f) => ({ ...f, relationshipStatus: s }))}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all active:scale-95"
                    style={active
                      ? { background: 'rgba(139,107,181,0.2)', border: '1px solid rgba(177,156,217,0.5)', color: '#d4c5f0' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9d96b0' }
                    }>
                    {STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9d96b0' }}>
              지금 가장 궁금한 질문 <span style={{ color: '#3e3850' }}>(선택)</span>
            </label>
            <textarea className={inputBase + ' resize-none'} style={{ ...inputStyle, minHeight: '80px' }}
              placeholder="예) 요즘 연락이 뜸한데 마음이 식은 건지 알고 싶어요"
              value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} rows={3} />
          </div>

          {/* Birth date */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9d96b0' }}>
              생년월일 <span style={{ color: '#3e3850' }}>(선택 — 사주 접목 시 활용)</span>
            </label>
            <input type="date" className={inputBase} style={inputStyle}
              value={form.birthDate} onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))} />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          {/* Submit */}
          <button type="submit" disabled={!isValid || loading}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: isValid ? 'linear-gradient(135deg, #6b3fa0 0%, #9b6dd0 100%)' : 'rgba(255,255,255,0.05)',
              color: isValid ? '#fff' : 'rgba(240,235,224,0.2)',
              boxShadow: isValid ? '0 4px 28px rgba(107,63,160,0.4)' : undefined,
            }}>
            {loading ? '준비 중...' : '카드 뽑으러 가기 →'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function ReadingPage() {
  return <Suspense><ReadingForm /></Suspense>;
}
