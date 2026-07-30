/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  FileCheck2, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Users 
} from 'lucide-react';
import { StudentRecord, TeacherProfile, ViewState } from '../types';

interface DashboardHomeProps {
  teacherProfile: TeacherProfile;
  roster: StudentRecord[];
  onNavigate: (view: ViewState) => void;
  onCopyText: (text: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  teacherProfile,
  roster,
  onNavigate,
  onCopyText
}) => {
  const totalCount = roster.length;
  const passCount = roster.filter((r) => r.verification.status === 'PASS').length;
  const reviewCount = totalCount - passCount;
  const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="doc-card rounded-lg p-6 bg-white border border-[#dcd7cb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#f0ebd9] text-[#1b2a4a] text-xs font-bold font-serif-doc mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>선생님 전용 안심 대시보드</span>
          </div>
          <h2 className="text-2xl font-black font-serif-doc text-[#1b2a4a]">
            반갑습니다, {teacherProfile.name}!
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            소속: {teacherProfile.school} | 오늘 등록된 세특 기록을 규정에 맞춰 안전하게 점검하고 관리합니다.
          </p>
        </div>

        <button
          onClick={() => onNavigate('setuk')}
          className="px-5 py-3 rounded bg-[#1b2a4a] hover:bg-[#283e6b] text-white font-serif-doc font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>새 세특 작성 및 검증</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="doc-card p-5 rounded-lg bg-white border border-[#dcd7cb] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-serif-doc">
            <span>이번 학기 세특 작성 수</span>
            <FileCheck2 className="w-4 h-4 text-[#1b2a4a]" />
          </div>
          <div className="text-3xl font-bold font-mono-code text-[#1b2a4a]">
            {totalCount + 12} <span className="text-xs font-normal text-slate-500 font-sans">건</span>
          </div>
          <p className="text-[11px] text-slate-500">
            학급 명단 등록: <strong className="font-mono-code">{totalCount}명</strong>
          </p>
        </div>

        {/* Metric 2 */}
        <div className="doc-card p-5 rounded-lg bg-white border border-[#dcd7cb] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-serif-doc">
            <span>규정 점검 통과율</span>
            <CheckCircle2 className="w-4 h-4 text-[#5f7a52]" />
          </div>
          <div className="text-3xl font-bold font-mono-code text-[#5f7a52]">
            {passRate} <span className="text-xs font-normal text-slate-500 font-sans">%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            총 {totalCount}명 중 <strong className="text-emerald-700">{passCount}명</strong> 점검 통과
          </p>
        </div>

        {/* Metric 3 */}
        <div className="doc-card p-5 rounded-lg bg-white border border-[#dcd7cb] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-serif-doc">
            <span>검토 필요 위험 항목</span>
            <AlertTriangle className="w-4 h-4 text-[#b8433d]" />
          </div>
          <div className={`text-3xl font-bold font-mono-code ${reviewCount > 0 ? 'text-[#b8433d]' : 'text-slate-700'}`}>
            {reviewCount} <span className="text-xs font-normal text-slate-500 font-sans">건</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {reviewCount > 0 ? '금지어/글자수/유사도 주의' : '위험 요소 없음'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="doc-card p-5 rounded-lg bg-white border border-[#dcd7cb] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-serif-doc">
            <span>수행평가 Rubric 생성</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-mono-code text-[#1b2a4a]">
            5 <span className="text-xs font-normal text-slate-500 font-sans">개 과목</span>
          </div>
          <p className="text-[11px] text-slate-500">
            성취기준 3단계 비율 자동 도출
          </p>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tile 1 */}
        <div
          onClick={() => onNavigate('setuk')}
          className="doc-card rounded-lg p-4 bg-white border border-[#c8d8c3] shadow-2xs hover:border-[#1b2a4a] transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#1b2a4a] text-white flex items-center justify-center font-bold flex-shrink-0">
              <FileCheck2 className="w-5 h-5 text-[#b8433d]" />
            </div>
            <h3 className="font-serif-doc font-bold text-sm text-[#1b2a4a] group-hover:text-[#b8433d] transition-colors">
              세특 작성 보조 및 규정 검증
            </h3>
          </div>
          <div className="text-xs font-bold text-[#1b2a4a] flex items-center space-x-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pl-2">
            <span>바로가기</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b8433d]" />
          </div>
        </div>

        {/* Tile 2 */}
        <div
          onClick={() => onNavigate('rubric')}
          className="doc-card rounded-lg p-4 bg-white border border-[#c8d8c3] shadow-2xs hover:border-[#1b2a4a] transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#1b2a4a] text-white flex items-center justify-center font-bold flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="font-serif-doc font-bold text-sm text-[#1b2a4a] group-hover:text-[#b8433d] transition-colors">
              수행평가 문항·Rubric 생성
            </h3>
          </div>
          <div className="text-xs font-bold text-[#1b2a4a] flex items-center space-x-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pl-2">
            <span>바로가기</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b8433d]" />
          </div>
        </div>

        {/* Tile 3 */}
        <div
          onClick={() => onNavigate('roster')}
          className="doc-card rounded-lg p-4 bg-white border border-[#c8d8c3] shadow-2xs hover:border-[#1b2a4a] transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#1b2a4a] text-white flex items-center justify-center font-bold flex-shrink-0">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-serif-doc font-bold text-sm text-[#1b2a4a] group-hover:text-[#b8433d] transition-colors">
              학급 세특 명단 통합 관리
            </h3>
          </div>
          <div className="text-xs font-bold text-[#1b2a4a] flex items-center space-x-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pl-2">
            <span>바로가기</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b8433d]" />
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="doc-card rounded-lg overflow-hidden border border-[#dcd7cb] bg-white">
        <div className="bg-[#1b2a4a] text-[#f7f5ef] px-5 py-3.5 flex items-center justify-between border-b-2 border-[#b8433d]">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-[#b8433d]" />
            <h3 className="font-serif-doc font-bold text-base">최근 작성 및 검증 완료 항목 리스트</h3>
          </div>
          <button
            onClick={() => onNavigate('roster')}
            className="text-xs text-[#dcd7ca] hover:text-white underline cursor-pointer"
          >
            전체 명단 보기 →
          </button>
        </div>

        <div className="p-4 bg-ruled-light space-y-3">
          {roster.length > 0 ? (
            roster.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded border border-[#dcd7cb] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold font-serif-doc text-sm text-[#1b2a4a]">
                      {item.studentName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#f0ebd9] text-[#1b2a4a] text-xs font-semibold">
                      {item.subject}
                    </span>
                    <span
                      className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded ${
                        item.verification.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.verification.status === 'PASS' ? '✓ 통과' : '⚠️ 검토필요'} ({item.verification.byteCount} B)
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {item.assembledText}
                  </p>
                </div>

                <button
                  onClick={() => onCopyText(item.assembledText)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center space-x-1 self-start sm:self-center transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>문장 복사</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              등록된 항목이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
