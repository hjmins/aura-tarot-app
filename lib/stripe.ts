import Stripe from 'stripe';

// 서버 사이드 전용
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const PRICE_KRW = 4900;
