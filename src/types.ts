/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ViewState = 'landing' | 'login' | 'dashboard' | 'setuk' | 'rubric' | 'roster';

export interface TeacherProfile {
  name: string;
  school: string;
  email: string;
}

export type SubjectOption = '공통국어1' | '공통수학1' | '공통영어1' | '통합사회' | '통합과학' | string;

export type AchievementLevel = '상' | '중' | '하';

export type AssessmentMethod = '보고서' | '발표' | '논술형' | '실험실습' | '토론';

export interface StudentInputForm {
  subject: SubjectOption;
  customSubject?: string;
  achievementLevel: AchievementLevel;
  studentName: string;
  taskTitle: string;
  observedBehavior: string;
  competency: string;
  growthAspect: string;
}

export interface ProhibitedCheckResult {
  hasProhibited: boolean;
  foundTerms: string[];
}

export interface SimilarityCheckResult {
  isWarning: boolean;
  targetStudentName?: string;
  targetStudentSubject?: string;
  similarityPercentage: number;
}

export interface VerificationResult {
  status: 'PASS' | 'REVIEW';
  byteCount: number;
  maxByteLimit: number;
  isByteOver: boolean;
  prohibited: ProhibitedCheckResult;
  duplicate: SimilarityCheckResult;
  verifiedAt: string;
}

export interface StudentRecord {
  id: string;
  subject: string;
  achievementLevel: AchievementLevel;
  studentName: string;
  taskTitle: string;
  observedBehavior: string;
  competency: string;
  growthAspect: string;
  assembledText: string;
  verification: VerificationResult;
  createdAt: string;
}

export interface RubricLevel {
  level: '상' | '중' | '하';
  scoreRangeText: string;
  minScore: number;
  maxScore: number;
  percentRangeText: string;
  criteria: string;
}

export interface AssessmentPlan {
  id: string;
  subject: string;
  achievementStandard: string;
  method: AssessmentMethod;
  maxScore: number;
  itemTitle: string;
  itemDescription: string;
  rubric: RubricLevel[];
  createdAt: string;
}
