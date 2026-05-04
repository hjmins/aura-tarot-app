import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_KRW } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const readingId = searchParams.get('id');

  if (!readingId) {
    return NextResponse.json({ error: 'reading id required' }, { status: 400 });
  }

  const origin = req.headers.get('origin') ?? 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'krw',
            product_data: {
              name: 'AI 타로 정밀 리포트',
              description: '상대 심리·연락 가능성·재회 확률·2주 흐름 분석',
            },
            unit_amount: PRICE_KRW,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/result/premium?id=${readingId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/result/free?id=${readingId}`,
      metadata: { readingId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'stripe session creation failed' }, { status: 500 });
  }
}
