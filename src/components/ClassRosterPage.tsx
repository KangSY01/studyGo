/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Download, 
  FileText, 
  Filter, 
  Plus, 
  Search, 
  Trash2, 
  Users 
} from 'lucide-react';
import { StudentRecord, ViewState } from '../types';

interface ClassRosterPageProps {
  roster: StudentRecord[];
  onRemoveFromRoster: (id: string) => void;
  onNavigate: (view: ViewState) => void;
  onCopyText: (text: string) => void;
}

export const ClassRosterPage: React.FC<ClassRosterPageProps> = ({
  roster,
  onRemoveFromRoster,
  onNavigate,
  onCopyText
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'REVIEW'>('ALL');

  // Filtered Roster
  const filteredRoster = roster.filter((item) => {
    const matchesSearch =
      item.studentName.includes(searchTerm) ||
      item.subject.includes(searchTerm) ||
      item.assembledText.includes(searchTerm);

    if (statusFilter === 'PASS') return matchesSearch && item.verification.status === 'PASS';
    if (statusFilter === 'REVIEW') return matchesSearch && item.verification.status === 'REVIEW';
    return matchesSearch;
  });

  // Batch Export Roster as TXT
  const handleExportRosterTXT = () => {
    if (roster.length === 0) return;

    let content = `====================================\n`;
    content += `기록결 (記錄結) - 학급 세특 기록 총괄 문서\n`;
    content += `출력 일시: ${new Date().toLocaleString('ko-KR')}\n`;
    content += `등록 인원: 총 ${roster.length}명\n`;
    content += `====================================\n\n`;

    roster.forEach((item, index) => {
      content += `[${index + 1}] 과목: ${item.subject} | 성취수준: ${item.achievementLevel} | 이름: ${item.studentName}\n`;
      content += `글자수: ${item.verification.byteCount} Bytes (${item.verification.status === 'PASS' ? '통과' : '검토필요'})\n`;
      content += `기록 내용:\n${item.assembledText}\n`;
      content += `------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `학급_세특기록_모음_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="doc-card rounded-lg p-5 bg-white border border-[#dcd7cb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#b8433d]" />
            <h2 className="text-xl font-bold font-serif-doc text-[#1b2a4a]">
              학급 세특 기록 및 중복 비교 명단
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            등록된 학생들의 세특 데이터를 관리하고 다음 작성 시 실시간 유사도 비교 자료로 활용합니다.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportRosterTXT}
            disabled={roster.length === 0}
            className="px-4 py-2 rounded bg-[#5f7a52] hover:bg-[#4d6442] disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>전체 내보내기(TXT)</span>
          </button>

          <button
            onClick={() => onNavigate('setuk')}
            className="px-4 py-2 rounded bg-[#1b2a4a] hover:bg-[#283e6b] text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>학생 세특 추가</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="doc-card rounded-lg p-4 bg-white border border-[#dcd7cb] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="학생 이름, 과목, 문장 검색..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-[#c8c2b4] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#1b2a4a]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-slate-500" />
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#1b2a4a] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            전체 ({roster.length})
          </button>
          <button
            onClick={() => setStatusFilter('PASS')}
            className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
              statusFilter === 'PASS'
                ? 'bg-[#5f7a52] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ✓ 통과 ({roster.filter((r) => r.verification.status === 'PASS').length})
          </button>
          <button
            onClick={() => setStatusFilter('REVIEW')}
            className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
              statusFilter === 'REVIEW'
                ? 'bg-[#b8433d] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ⚠️ 검토 필요 ({roster.filter((r) => r.verification.status === 'REVIEW').length})
          </button>
        </div>
      </div>

      {/* Roster Table / Card Container */}
      <div className="doc-card rounded-lg overflow-hidden border border-[#dcd7cb] bg-white">
        {filteredRoster.length > 0 ? (
          <div className="divide-y divide-[#e5e0d3]">
            {filteredRoster.map((student) => (
              <div
                key={student.id}
                className="p-5 bg-white hover:bg-slate-50/80 transition-colors space-y-3"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0ebd9] pb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-serif-doc font-bold text-base text-[#1b2a4a]">
                      {student.studentName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-[#f0ebd9] text-[#1b2a4a] text-xs font-bold font-serif-doc">
                      {student.subject}
                    </span>
                    <span className="text-xs text-slate-500 font-mono-code">
                      성취수준: {student.achievementLevel}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span
                      className={`font-mono-code font-bold px-2.5 py-1 rounded flex items-center space-x-1 ${
                        student.verification.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {student.verification.status === 'PASS' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>통과 ({student.verification.byteCount} B)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                          <span>검토 필요 ({student.verification.byteCount} B)</span>
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => onCopyText(student.assembledText)}
                      className="p-1.5 rounded text-slate-600 hover:text-[#1b2a4a] hover:bg-slate-200 transition-colors cursor-pointer"
                      title="문장 복사"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onRemoveFromRoster(student.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Assembled Sentence Text */}
                <p className="text-xs text-[#1b2a4a] leading-relaxed font-sans bg-ruled-light p-3 rounded border border-[#e5e0d3]">
                  {student.assembledText}
                </p>

                {/* Verification Flags */}
                {student.verification.status === 'REVIEW' && (
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {student.verification.isByteOver && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                        글자수 초과 ({student.verification.byteCount} / 1500 B)
                      </span>
                    )}
                    {student.verification.prohibited.hasProhibited && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                        금지어 포함 ({student.verification.prohibited.foundTerms.join(', ')})
                      </span>
                    )}
                    {student.verification.duplicate.isWarning && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                        유사도 경고 ({student.verification.duplicate.similarityPercentage}% - {student.verification.duplicate.targetStudentName})
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p>검색 조건에 맞는 학생 기록이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
