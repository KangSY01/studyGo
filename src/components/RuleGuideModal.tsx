/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, CheckCircle2, FileText, Info, Sparkles, X } from 'lucide-react';
import { OFFICIAL_PROHIBITED_TERMS } from '../utils/textAnalysis';

interface RuleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RuleGuideModal: React.FC<RuleGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#f7f5ef] border-2 border-[#1b2a4a] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#1b2a4a] text-[#f7f5ef] px-6 py-4 flex items-center justify-between border-b-2 border-[#b8433d]">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-[#b8433d]" />
            <h2 className="text-lg font-serif-doc font-bold">학교생활기록부 기재 및 점검 규정 가이드</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#dcd7ca] hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#1b2a4a]">
          {/* 1. Byte Calculation Rule */}
          <section className="bg-white p-4 rounded border border-[#dcd7cb]">
            <h3 className="font-serif-doc font-bold text-base text-[#1b2a4a] flex items-center space-x-2 border-b border-[#e5e0d3] pb-2 mb-2">
              <Info className="w-4 h-4 text-[#1b2a4a]" />
              <span>1. 글자 수 바이트(Byte) 산정 기준</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              고등학교 세부능력 및 특기사항은 과목당 최대 <strong>1,500 바이트</strong> 입력이 가능합니다.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono-code">
              <div className="p-2 bg-[#f7f5ef] rounded border border-[#e5e0d3]">
                <div className="text-slate-500 text-[11px]">한글</div>
                <div className="font-bold text-[#1b2a4a] mt-0.5">1자 = 3 바이트</div>
              </div>
              <div className="p-2 bg-[#f7f5ef] rounded border border-[#e5e0d3]">
                <div className="text-slate-500 text-[11px]">영문 / 숫자</div>
                <div className="font-bold text-[#1b2a4a] mt-0.5">1자 = 2 바이트</div>
              </div>
              <div className="p-2 bg-[#f7f5ef] rounded border border-[#e5e0d3]">
                <div className="text-slate-500 text-[11px]">공백 / 줄바꿈</div>
                <div className="font-bold text-[#1b2a4a] mt-0.5">1자 = 1 바이트</div>
              </div>
            </div>
          </section>

          {/* 2. Prohibited Expressions */}
          <section className="bg-white p-4 rounded border border-[#dcd7cb]">
            <h3 className="font-serif-doc font-bold text-base text-[#b8433d] flex items-center space-x-2 border-b border-[#e5e0d3] pb-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#b8433d]" />
              <span>2. 주요 기재 금지어 및 주의 표현</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              교외 대회, 자격증, 사교육 유발 요소 등 공정성을 해치는 표현은 생활기록부 입력 시 자동 반려 사유가 됩니다.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {OFFICIAL_PROHIBITED_TERMS.map((term) => (
                <span
                  key={term}
                  className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono-code"
                >
                  {term}
                </span>
              ))}
            </div>
          </section>

          {/* 3. Duplicate Record Checking */}
          <section className="bg-white p-4 rounded border border-[#dcd7cb]">
            <h3 className="font-serif-doc font-bold text-base text-[#5f7a52] flex items-center space-x-2 border-b border-[#e5e0d3] pb-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#5f7a52]" />
              <span>3. 학생 간 중복 기재 방지 (유사도 40% 이상 주의)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              동일 학급 학생들에게 일률적으로 동일한 세특 문장을 기재하는 행위는 교육청 시정 조치 대상입니다. 기록결은 <strong>2-gram Jaccard 유사도 알고리즘</strong>을 적용하여 40% 이상의 유사 문장이 감지되면 '검토 필요' 경고를 발생시킵니다.
            </p>
          </section>

          {/* 4. AI (Gemini API) Transparency & Capabilities */}
          <section className="bg-white p-4 rounded border border-[#dcd7cb]">
            <h3 className="font-serif-doc font-bold text-base text-[#1b2a4a] flex items-center space-x-2 border-b border-[#e5e0d3] pb-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>4. AI (Gemini API) 활용 투명성 및 서술 원칙</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              '기록결'은 AI가 학생의 사실을 무단으로 창작하지 않으며, 선생님이 직접 입력한 관찰 기록에 기반한 정교화 작업에만 서버측 Gemini API를 호출합니다.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-ruled-light border border-[#d8e5d2] space-y-1">
                <div className="font-bold text-[#1b2a4a] flex items-center space-x-1">
                  <span>• 세특 윤문 제안 (Gemini API)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  조립된 사실 문장의 표현과 어휘를 격식 있게 다듬어 2개 대안을 제시합니다. <strong>(사실 내용 추가 금지 원칙)</strong>
                </p>
              </div>

              <div className="p-2.5 rounded bg-ruled-light border border-[#d8e5d2] space-y-1">
                <div className="font-bold text-[#1b2a4a] flex items-center space-x-1">
                  <span>• 표현 다양화 제안 (Gemini API)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  유사도 40% 이상 경고 시, 원래 관찰 의미를 유지하면서 어순과 유의어를 활용해 중복률을 낮추는 문장 대안을 생성합니다.
                </p>
              </div>

              <div className="p-2.5 rounded bg-ruled-light border border-[#d8e5d2] space-y-1">
                <div className="font-bold text-[#1b2a4a] flex items-center space-x-1">
                  <span>• 수행평가 문항 및 3단계 Rubric 생성 (Gemini API)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  입력된 성취기준 텍스트를 정밀 분석하여 맞춤형 문항 지시사항과 상/중/하 3단계 채점기준표를 자동 구성합니다.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#e5e0d3] px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#1b2a4a] text-white hover:bg-[#2b3e66] text-xs font-medium transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
