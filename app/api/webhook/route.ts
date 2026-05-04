// Static export 호환 stub. Stripe Webhook은 App Hosting(SSR) 환경에서만 동작.
// 실제 Stripe 웹훅 연결 시: NEXT_PUBLIC_USE_MOCK=false + App Hosting 배포 후 아래 TODO 구현

export const dynamic = 'force-static';

export async function POST() {
  // TODO: Stripe 웹훅 연결 시 아래 코드로 교체
  // import { stripe } from '@/lib/stripe';
  // import { markAsPaid } from '@/lib/firestore';
  // const body = await req.text();
  // const sig = req.headers.get('stripe-signature') ?? '';
  // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  // if (event.type === 'checkout.session.completed') { await markAsPaid(...) }
  return Response.json({ received: false, note: 'Webhook not active in static/mock mode' }, { status: 501 });
}
