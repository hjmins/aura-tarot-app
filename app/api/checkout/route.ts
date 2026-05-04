// Static export 호환 stub. Mock 모드에서는 이 라우트가 호출되지 않음.
// 실제 Stripe 결제 연결 시: NEXT_PUBLIC_USE_MOCK=false + App Hosting 배포 후 아래 TODO 구현

export const dynamic = 'force-static';

export async function GET() {
  // TODO: Stripe 연결 시 아래 코드로 교체
  // import { stripe, PRICE_KRW } from '@/lib/stripe';
  // const { searchParams } = new URL(req.url);
  // const readingId = searchParams.get('id');
  // const session = await stripe.checkout.sessions.create({ ... });
  // return Response.json({ url: session.url });
  return Response.json({ error: 'Stripe not configured. Set NEXT_PUBLIC_USE_MOCK=false and deploy to App Hosting.' }, { status: 501 });
}
