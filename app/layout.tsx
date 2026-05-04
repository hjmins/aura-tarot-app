import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura — AI 타로 정밀 리포트',
  description: '상대의 속마음, 연락 가능성, 재회 흐름까지. AI가 분석하는 정밀 타로 리포트.',
  openGraph: {
    title: 'Aura — AI 타로 정밀 리포트',
    description: '상대의 속마음, 연락 가능성, 재회 흐름까지. AI가 분석하는 정밀 타로 리포트.',
    siteName: 'Aura',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body
        style={{
          background: 'linear-gradient(135deg, #0d0820 0%, #1a0f35 50%, #0f0a28 100%)',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
