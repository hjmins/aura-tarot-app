'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceType, RelationshipStatus } from '@/types';
import { createReading } from '@/lib/firestore';

const STATUSES: RelationshipStatus[] = ['썸', '연애중', '헤어짐', '읽씹/잠수', '짝사랑'];

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

  const isValid = form.userName && form.partnerName && form.relationshipStatus;

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
          ...form,
          serviceType,
          paid: false,
          createdAt: new Date().toISOString(),
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

  const inputClass = `
    w-full px-4 py-3.5 rounded-xl text-sm text-ivory placeholder:text-ivory/30
    outline-none transition-all
    focus:border-lavender/50 focus:shadow-glow-lavender
  `;
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <main className="min-h-screen px-4 py-12 max-w-lg mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs text-ivory-dim/60 hover:text-ivory-dim mb-8 transition-colors"
      >
        ← 뒤로
      </button>

      <div className="mb-8">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{ background: 'rgba(177,156,217,0.12)', color: '#d4c5f0' }}
        >
          {serviceType}
        </div>
        <h1 className="text-2xl font-extrabold text-ivory mb-1" style={{ letterSpacing: '-0.02em' }}>
          리딩 정보 입력
        </h1>
        <p className="text-sm text-ivory-dim/70">
          정확한 정보일수록 더 깊이 있는 리딩이 돼요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ivory-dim/70 mb-1.5">내 이름</label>
            <input
              className={inputClass}
              style={inputStyle}
              placeholder="예) 지수"
              value={form.userName}
              onChange={(e) => setForm((f) => ({ ...f, userName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ivory-dim/70 mb-1.5">상대 이름</label>
            <input
              className={inputClass}
              style={inputStyle}
              placeholder="예) 민준"
              value={form.partnerName}
              onChange={(e) => setForm((f) => ({ ...f, partnerName: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ivory-dim/70 mb-1.5">현재 관계 상태</label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm((f) => ({ ...f, relationshipStatus: s }))}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
                style={
                  form.relationshipStatus === s
                    ? { background: 'rgba(177,156,217,0.25)', color: '#d4c5f0', border: '1px solid rgba(177,156,217,0.5)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(240,235,224,0.5)', border: '1px solid rgba(255,255,255,0.1)' }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ivory-dim/70 mb-1.5">
            질문 내용 <span className="text-ivory-dim/40">(선택)</span>
          </label>
          <textarea
            className={inputClass + ' resize-none'}
            style={{ ...inputStyle, minHeight: '80px' }}
            placeholder="예) 요즘 연락이 뜸한데 마음이 식은 건지 알고 싶어요"
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ivory-dim/70 mb-1.5">
            생년월일 <span className="text-ivory-dim/40">(선택 — 사주 접목 시 활용)</span>
          </label>
          <input
            type="date"
            className={inputClass}
            style={inputStyle}
            value={form.birthDate}
            onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 mt-2"
          style={{
            background: isValid ? 'linear-gradient(135deg, #8b6bb5 0%, #b19cd9 100%)' : 'rgba(255,255,255,0.06)',
            color: isValid ? '#fff' : 'rgba(240,235,224,0.3)',
            boxShadow: isValid ? '0 0 24px rgba(177,156,217,0.3)' : undefined,
          }}
        >
          {loading ? '준비 중...' : '카드 선택하러 가기 →'}
        </button>
      </form>
    </main>
  );
}

export default function ReadingPage() {
  return (
    <Suspense>
      <ReadingForm />
    </Suspense>
  );
}
