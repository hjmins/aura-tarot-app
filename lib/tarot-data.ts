import { TarotCard } from '@/types';

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 0, nameKo: '바보', symbol: '◯',
    keywords: ['새 시작', '자유', '충동'],
    meaningUpright: '새로운 시작과 무한한 가능성. 상대도 새로운 감정을 느끼기 시작하고 있어요.',
    meaningReversed: '불안과 주저함. 상대가 선택을 망설이고 있는 상태예요.',
  },
  {
    id: 1, nameKo: '마법사', symbol: '∞',
    keywords: ['의지', '실행', '집중'],
    meaningUpright: '강한 의도와 실행력. 상대는 당신에게 먼저 행동하고 싶다는 마음이 있어요.',
    meaningReversed: '내면의 갈등. 하고 싶지만 망설이는 상태예요.',
  },
  {
    id: 2, nameKo: '여사제', symbol: '☽',
    keywords: ['직관', '비밀', '기다림'],
    meaningUpright: '말하지 않은 감정이 깊이 존재해요. 상대는 속으로 당신을 많이 생각하고 있어요.',
    meaningReversed: '감추고 있는 것이 있거나 혼란스러운 감정 상태예요.',
  },
  {
    id: 3, nameKo: '여황제', symbol: '♀',
    keywords: ['풍요', '따뜻함', '감성'],
    meaningUpright: '감정이 무르익고 있어요. 상대가 당신에게 따뜻한 감정을 키우고 있어요.',
    meaningReversed: '감정 표현이 막혀 있거나 의존하려는 경향이 있어요.',
  },
  {
    id: 4, nameKo: '황제', symbol: '♂',
    keywords: ['안정', '통제', '결단'],
    meaningUpright: '상대는 안정을 원하며 당신과의 관계를 진지하게 생각하고 있어요.',
    meaningReversed: '자존심이나 통제 욕구가 관계를 막고 있어요.',
  },
  {
    id: 5, nameKo: '연인', symbol: '♡',
    keywords: ['선택', '조화', '연결'],
    meaningUpright: '감정적 연결이 깊어지는 시기. 상대는 당신을 특별하게 느끼고 있어요.',
    meaningReversed: '관계에서의 갈등이나 선택의 기로에 서 있어요.',
  },
  {
    id: 6, nameKo: '전차', symbol: '▲',
    keywords: ['전진', '승리', '추진력'],
    meaningUpright: '상대는 당신을 향해 움직이고 싶다는 강한 의지가 있어요.',
    meaningReversed: '앞으로 나아가지 못하고 내면의 갈등이 있는 상태예요.',
  },
  {
    id: 7, nameKo: '힘', symbol: '⊕',
    keywords: ['용기', '인내', '내면의 힘'],
    meaningUpright: '부드러운 용기로 상황을 이끌 수 있어요. 상대도 당신의 강인함에 끌리고 있어요.',
    meaningReversed: '지쳐 있거나 감정적으로 소진된 상태예요.',
  },
  {
    id: 8, nameKo: '은둔자', symbol: '◈',
    keywords: ['고독', '내면 탐구', '성찰'],
    meaningUpright: '상대는 지금 자신의 감정을 정리하는 시간이 필요한 상태예요.',
    meaningReversed: '고립되거나 연결을 피하고 있는 상태예요.',
  },
  {
    id: 9, nameKo: '운명의 바퀴', symbol: '◎',
    keywords: ['변화', '전환점', '흐름'],
    meaningUpright: '상황이 당신에게 유리하게 돌아가는 시점이 오고 있어요.',
    meaningReversed: '예상치 못한 변수나 불운한 타이밍이에요.',
  },
  {
    id: 10, nameKo: '달', symbol: '🌙',
    keywords: ['무의식', '불안', '환상'],
    meaningUpright: '상대는 감정을 완전히 드러내지 않고 있어요. 진심이 숨겨져 있을 수 있어요.',
    meaningReversed: '혼란이나 오해가 관계를 어렵게 만들고 있어요.',
  },
  {
    id: 11, nameKo: '별', symbol: '✦',
    keywords: ['희망', '치유', '회복'],
    meaningUpright: '희망의 에너지. 관계가 회복되거나 새로운 연결이 시작될 수 있어요.',
    meaningReversed: '희망을 잃거나 포기하고 싶은 감정이 있어요.',
  },
];

export function getCardById(id: number): TarotCard | undefined {
  return TAROT_CARDS.find((c) => c.id === id);
}

export function getRandomCards(count: number): number[] {
  const shuffled = [...TAROT_CARDS.map((c) => c.id)].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
