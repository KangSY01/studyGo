/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProhibitedCheckResult, SimilarityCheckResult, StudentRecord } from '../types';

/**
 * Standard Korean High School Student Record (NEIS) Byte Calculation Rule:
 * - Hangul (가-힣, ㄱ-ㅎ, ㅏ-ㅣ): 3 bytes per char
 * - English letters (A-Z, a-z) & Numbers (0-9): 2 bytes per char (as specified in guidelines)
 * - ASCII Space, Newline, Punctuation: 1 byte per char
 * - Other Unicode / Symbols: 3 bytes
 */
export function calculateKoreanBytes(text: string): number {
  if (!text) return 0;

  let totalBytes = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const char = text[i];

    // Hangul range
    if ((charCode >= 0xac00 && charCode <= 0xd7a3) || 
        (charCode >= 0x1100 && charCode <= 0x11ff) || 
        (charCode >= 0x3130 && charCode <= 0x318f)) {
      totalBytes += 3;
    } 
    // English alphabets & numbers (specified as 2 bytes)
    else if (/[a-zA-Z0-9]/.test(char)) {
      totalBytes += 2;
    } 
    // ASCII spaces and standard punctuation (1 byte)
    else if (charCode <= 0x7f) {
      totalBytes += 1;
    } 
    // Other CJK / Unicode characters
    else {
      totalBytes += 3;
    }
  }

  return totalBytes;
}

/**
 * High School Student Record Prohibited Expressions List (NEIS Guidelines)
 */
export const OFFICIAL_PROHIBITED_TERMS = [
  "수상",
  "수상실적",
  "TOEIC",
  "TOEFL",
  "TEPS",
  "IELTS",
  "자격증",
  "방과후학교",
  "K-MOOC",
  "소논문",
  "연구보고서",
  "올림피아드",
  "경시대회",
  "특허",
  "학원",
  "사교육",
  "입시컨설팅",
  "토익",
  "토플",
  "텝스",
  "아이엘츠"
];

/**
 * Scans text for prohibited expressions
 */
export function scanProhibitedTerms(text: string, customTerms: string[] = OFFICIAL_PROHIBITED_TERMS): ProhibitedCheckResult {
  if (!text) {
    return { hasProhibited: false, foundTerms: [] };
  }

  const foundSet = new Set<string>();

  for (const term of customTerms) {
    if (!term || term.trim() === '') continue;
    // Case-insensitive search for English terms, exact substring match for Korean
    const regex = new RegExp(escapeRegExp(term), 'gi');
    if (regex.test(text)) {
      foundSet.add(term);
    }
  }

  const foundTerms = Array.from(foundSet);
  return {
    hasProhibited: foundTerms.length > 0,
    foundTerms
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculates 2-gram Jaccard Similarity between two texts (0 to 100%)
 */
export function calculate2GramJaccardSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;

  // Clean whitespace and punctuation for character n-gram comparison
  const clean1 = str1.replace(/\s+/g, '');
  const clean2 = str2.replace(/\s+/g, '');

  if (clean1.length < 2 || clean2.length < 2) {
    return clean1 === clean2 ? 100 : 0;
  }

  const getBigrams = (str: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.slice(i, i + 2));
    }
    return bigrams;
  };

  const set1 = getBigrams(clean1);
  const set2 = getBigrams(clean2);

  let intersectionCount = 0;
  set1.forEach((gram) => {
    if (set2.has(gram)) {
      intersectionCount++;
    }
  });

  const unionCount = set1.size + set2.size - intersectionCount;
  if (unionCount === 0) return 0;

  const similarityRatio = intersectionCount / unionCount;
  return Math.round(similarityRatio * 1000) / 10; // 1 decimal point e.g. 42.5%
}

/**
 * Compares current student's text with class roster to detect duplicate phrasing
 */
export function checkClassDuplicateSimilarity(
  currentText: string,
  roster: StudentRecord[],
  currentStudentId?: string,
  thresholdPercentage = 40
): SimilarityCheckResult {
  if (!currentText || !roster || roster.length === 0) {
    return { isWarning: false, similarityPercentage: 0 };
  }

  let highestSimilarity = 0;
  let matchingStudentName: string | undefined = undefined;
  let matchingStudentSubject: string | undefined = undefined;

  for (const student of roster) {
    if (currentStudentId && student.id === currentStudentId) continue;

    const sim = calculate2GramJaccardSimilarity(currentText, student.assembledText);
    if (sim > highestSimilarity) {
      highestSimilarity = sim;
      matchingStudentName = student.studentName;
      matchingStudentSubject = student.subject;
    }
  }

  return {
    isWarning: highestSimilarity >= thresholdPercentage,
    targetStudentName: matchingStudentName,
    targetStudentSubject: matchingStudentSubject,
    similarityPercentage: highestSimilarity
  };
}

/**
 * Assembles teacher observation inputs into a natural Korean student record text.
 * DOES NOT invent fake facts. Strictly structures teacher's inputs.
 */
export function assembleStudentRecordText(inputs: {
  subject: string;
  achievementLevel: string;
  studentName: string;
  taskTitle: string;
  observedBehavior: string;
  competency: string;
  growthAspect: string;
}): string {
  const { taskTitle, observedBehavior, competency, growthAspect } = inputs;

  const parts: string[] = [];

  if (taskTitle && taskTitle.trim()) {
    const cleanTask = taskTitle.trim().replace(/['"‘’]/g, '');
    parts.push(`'${cleanTask}' 활동에 참여하여`);
  }

  if (observedBehavior && observedBehavior.trim()) {
    let behavior = observedBehavior.trim();
    // Ensure smooth Korean sentence connection
    if (!behavior.endsWith('.')) {
      behavior += '.';
    }
    parts.push(behavior);
  }

  if (competency && competency.trim()) {
    let comp = competency.trim();
    if (!comp.endsWith('역량') && !comp.endsWith('능력') && !comp.endsWith('태도')) {
      comp += ' 역량';
    }
    parts.push(`이 과정에서 ${comp}을(를) 정교하게 발휘하였음.`);
  }

  if (growthAspect && growthAspect.trim()) {
    let growth = growthAspect.trim();
    if (!growth.endsWith('.')) {
      growth += '.';
    }
    parts.push(growth);
  }

  return parts.join(' ');
}
