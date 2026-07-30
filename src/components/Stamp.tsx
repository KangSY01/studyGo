/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VerificationResult } from '../types';

interface StampProps {
  verification: VerificationResult;
}

export const Stamp: React.FC<StampProps> = ({ verification }) => {
  const isPass = verification.status === 'PASS';

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-white/80 border border-[#dcd7cb] shadow-xs">
      {/* Signature Seal Stamp */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-28 h-28 rounded-full flex flex-col items-center justify-center p-2 text-center select-none animate-stamp ${
            isPass ? 'stamp-seal-pass' : 'stamp-seal-review'
          }`}
        >
          <div className="text-[10px] font-semibold tracking-widest opacity-80 uppercase">
            {isPass ? 'NEIS VERIFIED' : 'NEIS REVIEW'}
          </div>
          <div className="text-xl font-black font-serif-doc my-0.5 tracking-tight">
            {isPass ? '점검 통과' : '검토 필요'}
          </div>
          <div className="text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded border border-current opacity-80">
            {isPass ? '규정 준수' : '주의 요망'}
          </div>
        </div>
      </div>

      {/* Verification Breakdown Summary */}
      <div className="flex-1 w-full space-y-2 text-sm">
        <div className="flex items-center justify-between border-b border-[#e5e0d3] pb-1.5">
          <span className="font-serif-doc font-bold text-base text-[#1b2a4a]">
            {isPass ? '기록결 검증 완료 (통과)' : '기록결 검증 결과 (검토 항목 발견)'}
          </span>
          <span className="text-xs font-mono-code text-slate-500">
            {verification.verifiedAt}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {/* Byte Status */}
          <div
            className={`p-2 rounded border flex flex-col justify-between ${
              verification.isByteOver
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            }`}
          >
            <span className="font-semibold">1. 글자 수 (바이트)</span>
            <span className="font-mono-code font-bold mt-1">
              {verification.byteCount} / {verification.maxByteLimit} B
              {verification.isByteOver && ' (초과!)'}
            </span>
          </div>

          {/* Prohibited Status */}
          <div
            className={`p-2 rounded border flex flex-col justify-between ${
              verification.prohibited.hasProhibited
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            }`}
          >
            <span className="font-semibold">2. 금지 표현 스캔</span>
            <span className="font-bold mt-1">
              {verification.prohibited.hasProhibited
                ? `${verification.prohibited.foundTerms.length}개 감지됨`
                : '금지어 없음'}
            </span>
          </div>

          {/* Duplicate Status */}
          <div
            className={`p-2 rounded border flex flex-col justify-between ${
              verification.duplicate.isWarning
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            }`}
          >
            <span className="font-semibold">3. 학급 중복 유사도</span>
            <span className="font-mono-code font-bold mt-1">
              {verification.duplicate.similarityPercentage}%
              {verification.duplicate.isWarning ? ' (중복 위험)' : ' (안전)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
