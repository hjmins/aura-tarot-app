import {
  collection, doc, addDoc, getDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Reading, FreeResult, PremiumResult } from '@/types';

const COLLECTION = 'readings';

export async function createReading(data: Omit<Reading, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    paid: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getReading(id: string): Promise<Reading | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  } as Reading;
}

export async function updateSelectedCards(id: string, selectedCards: number[]): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { selectedCards });
}

export async function updateFreeResult(id: string, freeResult: FreeResult): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { freeResult });
}

export async function updatePremiumResult(id: string, premiumResult: PremiumResult): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { premiumResult, paid: true });
}

export async function markAsPaid(id: string, stripeSessionId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { paid: true, stripeSessionId });
}
