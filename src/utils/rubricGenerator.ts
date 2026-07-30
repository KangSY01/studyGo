/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssessmentMethod, AssessmentPlan, RubricLevel } from '../types';

export function generateRubricAndItemPlan(
  subject: string,
  achievementStandard: string,
  method: AssessmentMethod,
  maxScore: number
): AssessmentPlan {
  const safeScore = Math.max(10, Math.min(100, maxScore || 20));

  // Score Range Calculations:
  // 상: 85% ~ 100%
  // 중: 60% ~ 84%
  // 하: 0% ~ 59%
  const highMin = Math.round(safeScore * 0.85);
  const highMax = safeScore;

  const medMin = Math.round(safeScore * 0.60);
  const medMax = Math.max(medMin, highMin - 1);

  const lowMin = 0;
  const lowMax = Math.max(0, medMin - 1);

  // Clean standard text for prompt generation
  const cleanStandard = achievementStandard.trim() || '관련 성취기준에 따른 교과 탐구 수행';

  // Construct item title and description tailored to evaluation method
  let itemTitle = '';
  let itemDescription = '';

  switch (method) {
    case '보고서':
      itemTitle = `[수행평가 문항] ${subject} 성취기준 기반 탐구 보고서`;
      itemDescription = `다음에 제시된 성취기준('${cleanStandard}')을 반영하여, 탐구 주제를 선정한 뒤 수집한 자료의 객관적 근거를 바탕으로 논리적인 결론을 도출하는 탐구 보고서를 작성하시오. (분량: A4 2매 이내, 탐구 목적, 데이터/문헌 분석, 결론 및 소감 포함)`;
      break;
    case '발표':
      itemTitle = `[수행평가 문항] ${subject} 핵심 개념 비주얼 브리핑 및 발표`;
      itemDescription = `성취기준('${cleanStandard}')과 관련된 주요 주제를 선정하고, 시각 자료(시각 매체/발표 슬라이드)를 활용하여 청중이 이해하기 쉽게 5분 이내로 비평 및 논리적 구술 발표를 수행하시오.`;
      break;
    case '논술형':
      itemTitle = `[수행평가 문항] ${subject} 성취기준 연계 논술 및 비평문 작성`;
      itemDescription = `주어진 사회·학술적 쟁점 지문을 읽고 성취기준('${cleanStandard}')의 관점에서 자신의 견해를 논리적 근거 2가지 이상을 들어 600자 내외로 논술하시오.`;
      break;
    case '실험실습':
      itemTitle = `[수행평가 문항] ${subject} 탐구 실험 설계 및 정량 데이터 검증`;
      itemDescription = `성취기준('${cleanStandard}')의 원리를 검증하기 위한 실험 절차를 설계하고, 실험 도구를 안전하게 다루어 데이터를 정밀하게 측정한 뒤 실험 결과의 규칙성과 오차 요인을 분석하시오.`;
      break;
    case '토론':
      itemTitle = `[수행평가 문항] ${subject} 찬반 토론 및 입론서 작성`;
      itemDescription = `성취기준('${cleanStandard}')과 연계된 핵심 쟁점에 대해 찬성/반대 측 입론서를 작성하고, 상대측 입장에 대해 타당한 반론과 근거를 제시하며 경청과 존중의 태도로 토론에 참여하시오.`;
      break;
  }

  // Construct Rubric Criteria descriptors based on method
  let highCriteria = '';
  let medCriteria = '';
  let lowCriteria = '';

  switch (method) {
    case '보고서':
      highCriteria = `성취기준의 핵심 개념을 완벽히 이해하고, 신뢰성 있는 타당한 자료와 데이터 근거를 제시하여 탐구 결론을 논리정연하고 창의적으로 도출함.`;
      medCriteria = `성취기준의 주요 내용을 이해하고 탐구 결과를 작성하였으나, 제시한 자료 근거의 타당성이 다소 부족하거나 일부 논리적 연결이 미흡함.`;
      lowCriteria = `성취기준에 대한 이해도가 낮아 탐구 내용이 단순 정보 나열에 그치거나, 주장에 대한 적절한 근거 및 데이터 제시가 이루어지지 않음.`;
      break;

    case '발표':
      highCriteria = `주제에 대한 깊이 있는 이해를 바탕으로 명확한 시각 자료를 구성하고, 정돈된 언어와 자신감 있는 태도로 핵심 근거를 청중에게 설득력 있게 전달함.`;
      medCriteria = `발표 내용의 기본 요소는 전달되었으나 시각 자료의 효과성이 떨어지거나, 발표 태도 및 시간 배분에서 일부 매끄럽지 않은 부분이 관찰됨.`;
      lowCriteria = `발표 구성이 영세하거나 성취기준과의 연관성이 부족하며, 시각 자료 미비 및 불분명한 어조로 핵심 전달력이 현저히 떨어짐.`;
      break;

    case '논술형':
      highCriteria = `지문의 쟁점 및 성취기준을 맥락에 맞게 파악하고, 자신의 주장을 뒷받침하는 구체적이고 명확한 근거 2가지 이상을 들어 완성도 높은 글을 서술함.`;
      medCriteria = `자신의 주장은 명확히 제시하였으나 제시한 근거가 다소 일반적이거나, 서술 과정에서 논리적 비약이나 문장 호응의 미흡함이 일부 존재함.`;
      lowCriteria = `주제 및 성취기준에서 벗어난 주장을 제시하거나, 주장에 대한 근거가 없으며 지정된 분량 및 형식을 충족하지 못함.`;
      break;

    case '실험실습':
      highCriteria = `실험 원리 및 성취기준을 바탕으로 절차를 정교하게 설계하고, 데이터 수집 시 오차를 점검하며 탐구 결과의 규칙성을 정확하게 도출하고 안전 수칙을 엄수함.`;
      medCriteria = `실험 절차에 따라 측정을 수행하였으나 데이터 분석 과정에서 일부 단순 오차를 간과하거나 원인 해석이 다소 미진함.`;
      lowCriteria = `실험 도구 조작 미숙으로 데이터 측정에 실패하거나, 결과 분석 및 오차 검토 능력이 현저히 부족함.`;
      break;

    case '토론':
      highCriteria = `쟁점에 대한 객관적 데이터와 법적·사회적 근거를 바탕으로 입론을 정교하게 펼치며, 상대방 질문에 논리적으로 응대하고 민주적 토론 태도를 견지함.`;
      medCriteria = `입론과 반론 과정에 참여하였으나 일부 주장이 주관적 의견에 치우치거나, 상대방 견해에 대한 즉각적 논리 대응이 다소 부족함.`;
      lowCriteria = `토론 규칙을 준수하지 않거나 성취기준에 부합하는 타당한 근거 제시 없이 감정적 주장을 반복함.`;
      break;
  }

  const rubric: RubricLevel[] = [
    {
      level: '상',
      scoreRangeText: `${highMin}점 ~ ${highMax}점`,
      minScore: highMin,
      maxScore: highMax,
      percentRangeText: '85% ~ 100%',
      criteria: highCriteria
    },
    {
      level: '중',
      scoreRangeText: `${medMin}점 ~ ${medMax}점`,
      minScore: medMin,
      maxScore: medMax,
      percentRangeText: '60% ~ 84%',
      criteria: medCriteria
    },
    {
      level: '하',
      scoreRangeText: `${lowMin}점 ~ ${lowMax}점`,
      minScore: lowMin,
      maxScore: lowMax,
      percentRangeText: '0% ~ 59%',
      criteria: lowCriteria
    }
  ];

  return {
    id: `plan-${Date.now()}`,
    subject,
    achievementStandard: cleanStandard,
    method,
    maxScore: safeScore,
    itemTitle,
    itemDescription,
    rubric,
    createdAt: new Date().toISOString()
  };
}
