export type RelationshipStatus = '썸' | '연애중' | '헤어짐' | '읽씹/잠수' | '짝사랑';
export type ServiceType = '상대 속마음 보기' | '연락 올 가능성 보기' | '재회 가능성 보기' | '직접 질문하기';

export interface TarotCard {
  id: number;
  nameKo: string;
  symbol: string;
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
}

export interface CardReading {
  cardId: number;
  role: string;
  isReversed: boolean;
  shortReading: string;
}

export interface FreeResult {
  cards: CardReading[];
  summary: string;
}

export interface PremiumResult {
  overallSummary: string;
  partnerPsychology: string;
  hiddenEmotions: string;
  contactProbability: number;
  reunionProbability: number;
  nextTwoWeeks: string;
  thingsToAvoid: string[];
  recommendedActions: string[];
  finalAdvice: string;
}

export interface Reading {
  id?: string;
  serviceType: ServiceType;
  userName: string;
  partnerName: string;
  relationshipStatus: RelationshipStatus;
  question: string;
  birthDate?: string;
  selectedCards?: number[];
  freeResult?: FreeResult;
  premiumResult?: PremiumResult;
  paid: boolean;
  stripeSessionId?: string;
  createdAt: Date;
}
