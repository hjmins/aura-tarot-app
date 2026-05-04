import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { markAsPaid } from '@/lib/firestore';

// TODO: Stripe 웹훅 서명 검증 추가
// 대시보드 > Webhooks > Signing secret 을 STRIPE_WEBHOOK_SECRET 환경변수에 설정

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { id: string; metadata?: { readingId?: string } };
    const readingId = session.metadata?.readingId;
    if (readingId) {
      await markAsPaid(readingId, session.id);
    }
  }

  return NextResponse.json({ received: true });
}
