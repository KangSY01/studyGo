/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  FileCheck2, 
  LogIn, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Table 
} from 'lucide-react';

interface LandingPageProps {
  onGoToLogin: () => void;
  onOpenGuideModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onOpenGuideModal
}) => {
  return (
    <div className="min-h-screen bg-ruled-paper flex flex-col text-[#1b2a4a]">
      {/* Landing Header */}
      <header className="bg-[#1b2a4a] text-[#f7f5ef] border-b-4 border-[#b8433d] shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded border-2 border-[#f7f5ef] bg-[#b8433d] flex items-center justify-center font-serif-doc text-white font-bold text-lg shadow-inner select-none">
              結
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black font-serif-doc tracking-tight text-[#f7f5ef]">
                기록결 <span className="text-xs text-slate-300 font-sans font-normal">(記錄結)</span>
              </span>
              <p className="text-[11px] text-[#d4cebd] hidden sm:block">
                고등학교 교사 세특 작성 보조 및 규정 검증 서비스
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenGuideModal}
              className="text-xs text-[#dcd7ca] hover:text-white underline decoration-dotted hidden sm:inline-block cursor-pointer"
            >
              기재 규정 가이드
            </button>
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 rounded bg-[#b8433d] hover:bg-[#a23832] text-white font-serif-doc font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인 / 시작하기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif-doc tracking-tight text-[#1b2a4a] leading-tight max-w-4xl mx-auto">
          AI가 대신 쓰지 않습니다. <span className="text-[#b8433d] underline decoration-[#1b2a4a]/20 underline-offset-8">선생님의 관찰 사실</span>을 안전하게 검증합니다.
        </h1>

        <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed font-sans">
          고등학교 교사 세특 작성 보조 및 NEIS 글자수·금지어·유사도 규정 자동 검증 서비스
        </p>

        {/* CTA Button */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={onGoToLogin}
            className="px-8 py-3.5 rounded-md bg-[#1b2a4a] hover:bg-[#273d6b] text-[#f7f5ef] font-serif-doc font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#3e5380]"
          >
            <span>교사 대시보드 바로가기</span>
            <ArrowRight className="w-4 h-4 text-[#b8433d]" />
          </button>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-left">
          <div className="p-3 bg-white rounded border border-[#c8d8c3] shadow-2xs flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5f7a52]"></span>
            <div>
              <div className="text-xs font-bold font-serif-doc">NEIS 글자수 바이트</div>
              <div className="text-[11px] text-slate-500">한글 3B / 영문·숫자 2B 정확 산정</div>
            </div>
          </div>

          <div className="p-3 bg-white rounded border border-[#c8d8c3] shadow-2xs flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b8433d]"></span>
            <div>
              <div className="text-xs font-bold font-serif-doc">기재 금지 표현 스캔</div>
              <div className="text-[11px] text-slate-500">수상실적, 자격증, 사교육 실시간 검출</div>
            </div>
          </div>

          <div className="p-3 bg-white rounded border border-[#c8d8c3] shadow-2xs flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b2a4a]"></span>
            <div>
              <div className="text-xs font-bold font-serif-doc">학급 중복 기재 검사</div>
              <div className="text-[11px] text-slate-500">2-gram 유사도 40% 이상 경고</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section (2 Main Features) */}
      <section className="py-10 bg-white/70 border-y border-[#c8d8c3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-serif-doc text-[#1b2a4a]">
              선생님의 업무를 보조하는 2가지 핵심 기능
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 Card: 세특 작성 보조 */}
            <div className="doc-card rounded-lg p-5 bg-white border border-[#c8d8c3] shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded bg-[#1b2a4a] text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                    <FileCheck2 className="w-5 h-5 text-[#b8433d]" />
                  </div>
                  <h3 className="text-lg font-bold font-serif-doc text-[#1b2a4a]">
                    1. 세특 작성 보조 및 규정 자동 검증
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 pt-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5f7a52] flex-shrink-0" />
                    <span>입력 단어를 자의적 픽션 없이 서술문으로 충실히 구조화</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5f7a52] flex-shrink-0" />
                    <span>글자수 바이트, NEIS 금지어, 학급 중복 유사도 3초 검증</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onGoToLogin}
                className="w-full py-2.5 rounded bg-[#e2eee0] hover:bg-[#d2e3d0] text-[#1b2a4a] font-serif-doc font-bold text-xs transition-colors cursor-pointer border border-[#b2cca8]"
              >
                세특 보조 및 검증 시작하기 →
              </button>
            </div>

            {/* Feature 2 Card: 수행평가 Rubric 생성 */}
            <div className="doc-card rounded-lg p-5 bg-white border border-[#c8d8c3] shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded bg-[#1b2a4a] text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <h3 className="text-lg font-bold font-serif-doc text-[#1b2a4a]">
                    2. 수행평가 문항 및 3단계 Rubric 생성
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 pt-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5f7a52] flex-shrink-0" />
                    <span>2022 개정 교육과정 성취기준 연계 맞춤 평가 지시문</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5f7a52] flex-shrink-0" />
                    <span>상/중/하 3단계 채점기준표(Rubric) 및 배점 범위 자동 도출</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onGoToLogin}
                className="w-full py-2.5 rounded bg-[#e2eee0] hover:bg-[#d2e3d0] text-[#1b2a4a] font-serif-doc font-bold text-xs transition-colors cursor-pointer border border-[#b2cca8]"
              >
                Rubric 생성 도구 이용하기 →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#dcd7cb] bg-[#1b2a4a] text-[#dcd7ca] py-6 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto space-y-1">
          <p className="font-serif-doc font-bold text-sm text-[#f7f5ef]">
            기록결 (記錄結) - 고등학교 교사용 생활기록부 검증 도구
          </p>
          <p className="text-slate-400 text-[11px]">
            © 2026 기록결. Pure Client-Side Official High School Teacher Utility.
          </p>
        </div>
      </footer>
    </div>
  );
};
