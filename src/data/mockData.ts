/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentInputForm, StudentRecord } from '../types';

export const SAMPLE_STUDENT_PRESETS: { label: string; data: StudentInputForm }[] = [
  {
    label: '통합사회 - 기후 변화와 이산화탄소 분석 (상)',
    data: {
      subject: '통합사회',
      achievementLevel: '상',
      studentName: '김민준',
      taskTitle: '기후 변화와 이산화탄소 배출에 관한 탐구 보고서 작성',
      observedBehavior: '국가별 이산화탄소 배출 데이터를 수집하여 변수 간 상관관계를 시각화 그래프로 정교하게 구현하고 원인별 배출 영향을 계량적으로 분석함.',
      competency: '비판적 사고력 및 데이터 분석',
      growthAspect: '초기에는 단편적 자료 나열에 그쳤으나 오류 분석과 통계 검증을 거쳐 데이터에 기반한 논리적 결론을 도출하는 정교함을 갖춤.'
    }
  },
  {
    label: '공통국어1 - 고전 시가 비평 및 논술 (상)',
    data: {
      subject: '공통국어1',
      achievementLevel: '상',
      studentName: '이서연',
      taskTitle: '고전 시가에 나타난 화자의 정서와 현대적 재해석 비평문 작성',
      observedBehavior: '고전 작품의 화자가 직면한 상황과 언어적 표현의 함축성을 비교 분석하여 화자의 내면심리를 다각도로 해석하고 비평을 작성함.',
      competency: '문학적 감상력 및 논리적 표현',
      growthAspect: '작품의 배경지식과 화자의 어조 변화를 연계하여 감상의 깊이를 확장하고 이를 바탕으로 창의적 시각의 논리를 전개함.'
    }
  },
  {
    label: '통합과학 - 친환경 에너지 변환 실험 (중)',
    data: {
      subject: '통합과학',
      achievementLevel: '중',
      studentName: '박지훈',
      taskTitle: '태양광 발전 효율 향상을 위한 셀 각도 측정 실험',
      observedBehavior: '태양광 패널의 입사각 변화에 따른 전력 생산량 데이터를 측정하고 일일 시간대별 효율 변화 추이를 기록함.',
      competency: '실험 설계 및 탐구 태도',
      growthAspect: '실험 과정의 오차 원인을 스스로 점검하여 데이터 측정 방식을 보완하는 진전을 보임.'
    }
  }
];

export const INITIAL_CLASS_ROSTER: StudentRecord[] = [
  {
    id: 'roster-1',
    subject: '통합사회',
    achievementLevel: '상',
    studentName: '이서현',
    taskTitle: '기후 변화와 이산화탄소 배출에 관한 탐구 보고서 작성',
    observedBehavior: '국가별 이산화탄소 배출 데이터를 수집하여 변수 간 상관관계를 시각화 그래프로 정교하게 구현하고 원인별 배출 영향을 계량적으로 분석함.',
    competency: '비판적 사고력 및 데이터 분석',
    growthAspect: '초기에는 단편적 자료 나열에 그쳤으나 오류 분석과 통계 검증을 거쳐 데이터에 기반한 논리적 결론을 도출하는 정교함을 갖춤.',
    assembledText: "'기후 변화와 이산화탄소 배출에 관한 탐구 보고서 작성' 활동에 참여하여 국가별 이산화탄소 배출 데이터를 수집하여 변수 간 상관관계를 시각화 그래프로 정교하게 구현하고 원인별 배출 영향을 계량적으로 분석함. 이 과정에서 비판적 사고력 및 데이터 분석 역량을 발휘하였으며, 초기에는 단편적 자료 나열에 그쳤으나 오류 분석과 통계 검증을 거쳐 데이터에 기반한 논리적 결론을 도출하는 정교함을 갖춤.",
    verification: {
      status: 'PASS',
      byteCount: 468,
      maxByteLimit: 1500,
      isByteOver: false,
      prohibited: { hasProhibited: false, foundTerms: [] },
      duplicate: { isWarning: false, similarityPercentage: 0 },
      verifiedAt: '2026-07-30 10:15'
    },
    createdAt: '2026-07-30T10:15:00Z'
  },
  {
    id: 'roster-2',
    subject: '통합사회',
    achievementLevel: '중',
    studentName: '정우진',
    taskTitle: '지역 사회 도시 재생 사례 탐구',
    observedBehavior: '구도심의 상권 변화 수치를 조사하고 지자체의 주거 환경 개선 사업 보고서를 비교 분석하여 문제점과 개선안을 제시함.',
    competency: '문제 해결력 및 공동체 의식',
    growthAspect: '현장 방문 인터뷰 자료를 적극 활용하여 지역 주민의 생생한 요구사항을 결론 도출 과정에 충실히 반영함.',
    assembledText: "'지역 사회 도시 재생 사례 탐구' 활동에 참여하여 구도심의 상권 변화 수치를 조사하고 지자체의 주거 환경 개선 사업 보고서를 비교 분석하여 문제점과 개선안을 제시함. 이 과정에서 문제 해결력 및 공동체 의식 역량을 발휘하였으며, 현장 방문 인터뷰 자료를 적극 활용하여 지역 주민의 생생한 요구사항을 결론 도출 과정에 충실히 반영함.",
    verification: {
      status: 'PASS',
      byteCount: 422,
      maxByteLimit: 1500,
      isByteOver: false,
      prohibited: { hasProhibited: false, foundTerms: [] },
      duplicate: { isWarning: false, similarityPercentage: 12.4 },
      verifiedAt: '2026-07-30 10:20'
    },
    createdAt: '2026-07-30T10:20:00Z'
  },
  {
    id: 'roster-3',
    subject: '공통수학1',
    achievementLevel: '상',
    studentName: '최예은',
    taskTitle: '이차함수의 최댓값·최솟값을 활용한 최적화 실생활 문제 해결',
    observedBehavior: '물류 이동 경로 단축 및 비용 최소화를 이차함수 모델로 수식화하고 범위를 제한한 최댓값 추론 과정을 정교하게 전개함.',
    competency: '수학적 모델링 및 논리적 추론',
    growthAspect: '단순 수식 계산을 넘어 실생활 조건의 제약 요소를 고려하는 수학적 유연성을 보임.',
    assembledText: "'이차함수의 최댓값·최솟값을 활용한 최적화 실생활 문제 해결' 활동에 참여하여 물류 이동 경로 단축 및 비용 최소화를 이차함수 모델로 수식화하고 범위를 제한한 최댓값 추론 과정을 정교하게 전개함. 이 과정에서 수학적 모델링 및 논리적 추론 역량을 발휘하였으며, 단순 수식 계산을 넘어 실생활 조건의 제약 요소를 고려하는 수학적 유연성을 보임.",
    verification: {
      status: 'PASS',
      byteCount: 435,
      maxByteLimit: 1500,
      isByteOver: false,
      prohibited: { hasProhibited: false, foundTerms: [] },
      duplicate: { isWarning: false, similarityPercentage: 8.1 },
      verifiedAt: '2026-07-30 10:30'
    },
    createdAt: '2026-07-30T10:30:00Z'
  }
];

export const PRESET_ACHIEVEMENT_STANDARDS = [
  {
    subject: '통합사회',
    standard: '[10통사01-02] 사회 현상을 다양한 자료를 활용하여 탐구하고 근거를 들어 설명할 수 있다.',
    methods: ['보고서', '발표', '논술형']
  },
  {
    subject: '공통국어1',
    standard: '[10국01-02] 다양한 관점과 매체를 바탕으로 화자의 의도를 파악하고 논리적으로 비평하는 글을 작성할 수 있다.',
    methods: ['보고서', '논술형', '발표']
  },
  {
    subject: '공통수학1',
    standard: '[10수02-01] 이차방정식과 이차함수의 관계를 이해하고 실생활의 최적화 문제를 수학적으로 추론하여 해결할 수 있다.',
    methods: ['보고서', '논술형']
  },
  {
    subject: '통합과학',
    standard: '[10통과03-01] 에너지의 변환과 보존 법칙을 실험을 통해 검증하고 친환경 에너지 기술의 원리를 분석할 수 있다.',
    methods: ['실험실습', '보고서', '발표']
  },
  {
    subject: '통합사회',
    standard: '[10통사04-03] 인권과 정의에 관한 사회적 쟁점을 다각도로 분석하고 타인의 의견을 존중하며 토론할 수 있다.',
    methods: ['토론', '발표', '논술형']
  }
];
