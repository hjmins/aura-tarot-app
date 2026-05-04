import { Reading, FreeResult, PremiumResult, CardReading } from '@/types';
import { getCardById } from './tarot-data';

// ─────────────────────────────────────────
// Mock 데이터: 실제 AI 연결 전 테스트용
// ─────────────────────────────────────────

function getMockFreeResult(reading: Reading): FreeResult {
  const cardIds = reading.selectedCards ?? [5, 2, 9];
  const roles = ['상대의 현재 감정', '연락/행동을 망설이는 이유', '앞으로의 흐름'];

  const cards: CardReading[] = cardIds.map((id, i) => {
    const card = getCardById(id);
    const isReversed = Math.random() > 0.6;
    return {
      cardId: id,
      role: roles[i],
      isReversed,
      shortReading: isReversed ? (card?.meaningReversed ?? '') : (card?.meaningUpright ?? ''),
    };
  });

  return {
    cards,
    summary: `${reading.partnerName}님은 지금 ${reading.userName}님을 생각하고 있지만, 감정 표현을 망설이고 있어요. 카드는 앞으로 2주 안에 변화가 올 수 있다고 말하고 있어요.`,
  };
}

function getMockPremiumResult(reading: Reading): PremiumResult {
  const isBreakup = reading.relationshipStatus === '헤어짐';
  const isGhosted = reading.relationshipStatus === '읽씹/잠수';

  return {
    overallSummary: `${reading.partnerName}님은 현재 ${reading.userName}님에 대한 감정이 완전히 사라진 게 아니에요. 표현하지 못하고 있을 뿐, 내면에는 복잡한 감정이 공존하고 있어요. 지금 이 순간의 에너지는 "기다림"보다 "조용한 행동"이 더 효과적이에요.`,

    partnerPsychology: isBreakup
      ? `${reading.partnerName}님은 헤어진 이후에도 ${reading.userName}님에 대한 기억을 자주 떠올리고 있어요. 다만 자존심과 두려움이 먼저 연락하는 것을 막고 있는 상태예요. 혼자 있을 때 그리움이 올라오지만 표현하지 못하고 있어요.`
      : isGhosted
      ? `잠수를 타는 이유는 감정이 없어서가 아니라, 지금 자신의 상황이나 감정 상태가 불안정하기 때문일 가능성이 높아요. ${reading.partnerName}님 내면에는 죄책감도 함께 존재해요.`
      : `${reading.partnerName}님은 지금 ${reading.userName}님에 대해 편안하면서도 설레는 감정을 동시에 느끼고 있어요. 하지만 이 감정이 진심인지, 아니면 의존인지 스스로도 확신하지 못하고 있는 상태예요.`,

    hiddenEmotions: `${reading.partnerName}님이 숨기고 있는 가장 큰 감정은 "놓치기 싫다"는 두려움이에요. 겉으로는 무관심하거나 거리를 두는 것처럼 보여도, 내면에선 당신의 근황이 신경 쓰여요. 특히 ${reading.userName}님이 다른 사람과 잘 지내는 것을 보면 복잡한 감정이 올라와요.`,

    contactProbability: isGhosted ? 62 : isBreakup ? 54 : 78,
    reunionProbability: isBreakup ? 61 : 0,

    nextTwoWeeks: `이번 주 후반부터 ${reading.partnerName}님이 SNS나 메신저에서 당신의 흔적을 확인하려는 행동이 나타날 수 있어요. 2주 차에는 직접 연락 또는 공통 지인을 통한 간접 연락이 올 가능성이 있어요. 타이밍은 주말보다 평일 저녁이 더 높아요.`,

    thingsToAvoid: [
      '먼저 연락해서 감정을 확인하려는 행동 (역효과 가능)',
      'SNS에 슬픔이나 그리움을 암시하는 게시물 올리기',
      '공통 지인을 통해 상대방 감정을 캐묻는 것',
      '결론을 서두르거나 관계를 강제로 규정하려는 시도',
    ],

    recommendedActions: [
      `자신의 일상을 충실히 채우고, SNS에 자연스럽고 밝은 모습을 보여주세요.`,
      `2주 후 가볍고 부담 없는 안부 메시지를 먼저 보내는 것을 고려해 보세요.`,
      `${reading.partnerName}님과 좋았던 공통의 추억이 담긴 장소나 주제를 가볍게 언급해보세요.`,
    ],

    finalAdvice: `지금 이 순간, 가장 중요한 건 ${reading.partnerName}님의 반응을 기다리는 게 아니라 ${reading.userName}님 자신의 에너지를 높이는 거예요. 당신이 더 빛날수록, 상대는 자연스럽게 당신에게 끌려와요. 카드는 조급함이 아닌 여유로운 태도가 이 상황을 바꿀 열쇠라고 말하고 있어요.`,
  };
}

// ─────────────────────────────────────────
// 실제 AI 연결 구조 (TODO: OpenAI 연결)
// ─────────────────────────────────────────

async function getRealFreeResult(_reading: Reading): Promise<FreeResult> {
  // TODO: OpenAI API 연결
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4o',
  //   messages: [{ role: 'user', content: buildFreePrompt(_reading) }],
  // });
  throw new Error('OpenAI not connected yet');
}

async function getRealPremiumResult(_reading: Reading): Promise<PremiumResult> {
  // TODO: OpenAI API 연결
  throw new Error('OpenAI not connected yet');
}

// ─────────────────────────────────────────
// 공개 함수: env에 따라 mock/real 전환
// ─────────────────────────────────────────

export async function generateFreeResult(reading: Reading): Promise<FreeResult> {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
  if (useMock) return getMockFreeResult(reading);
  return getRealFreeResult(reading);
}

export async function generatePremiumResult(reading: Reading): Promise<PremiumResult> {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
  if (useMock) return getMockPremiumResult(reading);
  return getRealPremiumResult(reading);
}
