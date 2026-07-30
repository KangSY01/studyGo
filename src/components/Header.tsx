/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, FileCheck2, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'setuk' | 'rubric';
  setActiveTab: (tab: 'setuk' | 'rubric') => void;
  onOpenGuideModal: () => void;
  rosterCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGuideModal,
  rosterCount
}) => {
  return (
    <header className="no-print bg-[#1b2a4a] text-[#f7f5ef] border-b-4 border-[#b8433d] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            {/* Stamp Logo Emblem */}
            <div className="w-11 h-11 rounded border-2 border-[#f7f5ef] bg-[#b8433d] flex items-center justify-center font-serif-doc text-white font-bold text-xl shadow-inner select-none flex-shrink-0">
              結
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black font-serif-doc tracking-tight text-[#f7f5ef]">
                  기록결 <span className="text-sm font-normal text-slate-300 font-sans">(記錄結)</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded bg-[#2e4066] text-[#e8e4d8] border border-[#3e5380]">
                  고등학교 교사 검증 도구
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#d4cebd] mt-0.5">
                선생님의 관찰 사실을 구조화하고 규정 위반 위험을 사전에 검증합니다
              </p>
            </div>
          </div>

          {/* Action Links & Roster Badge */}
          <div className="flex items-center space-x-3 text-xs sm:text-sm">
            <button
              onClick={onOpenGuideModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#2a3c63] hover:bg-[#384e7d] text-[#f7f5ef] border border-[#3e5380] transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#dcd7ca]" />
              <span>NEIS 기재 규정 요약</span>
            </button>

            <div className="px-3 py-1.5 rounded bg-[#131f38] text-[#dcd7ca] border border-[#2a3c63] flex items-center space-x-1.5 font-mono-code">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>등록 학생: <strong>{rosterCount}명</strong></span>
            </div>
          </div>
        </div>

        {/* Concept Discipline Banner */}
        <div className="mt-4 p-3 rounded bg-[#24355a] border border-[#354b7a] flex items-start space-x-2.5 text-xs text-[#e5dfce]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">AI가 세특을 자의적으로 창작하지 않습니다.</strong> 선생님이 직접 입력하신 관찰 사실과 성취 내용을 정해진 원문 템플릿에 맞춰 구조화하고, <span className="text-amber-300 font-medium">글자수 초과 · 기재 금지 표현 · 학급 중복 기재</span> 위험만을 신뢰성 있게 자동 검증합니다.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 flex space-x-2 border-b border-[#2e4066]">
          <button
            onClick={() => setActiveTab('setuk')}
            className={`flex items-center space-x-2 px-5 py-2.5 font-serif-doc font-bold text-sm sm:text-base border-b-2 transition-all cursor-pointer ${
              activeTab === 'setuk'
                ? 'border-[#b8433d] text-white bg-[#24355a] rounded-t-md'
                : 'border-transparent text-[#b0a998] hover:text-white hover:bg-[#1a2846]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>1. 세특 작성 보조 및 검증</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`flex items-center space-x-2 px-5 py-2.5 font-serif-doc font-bold text-sm sm:text-base border-b-2 transition-all cursor-pointer ${
              activeTab === 'rubric'
                ? 'border-[#b8433d] text-white bg-[#24355a] rounded-t-md'
                : 'border-transparent text-[#b0a998] hover:text-white hover:bg-[#1a2846]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. 수행평가 문항·Rubric 생성</span>
          </button>
        </div>
      </div>
    </header>
  );
};
