/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { StudentRecord } from './types';
import { INITIAL_CLASS_ROSTER } from './data/mockData';
import { Header } from './components/Header';
import { RuleGuideModal } from './components/RuleGuideModal';
import { TabSetukHelper } from './components/TabSetukHelper';
import { TabRubricGenerator } from './components/TabRubricGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'setuk' | 'rubric'>('setuk');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Class Roster state with localStorage persistence
  const [roster, setRoster] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('girokgyeol_roster');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved roster:', e);
    }
    return INITIAL_CLASS_ROSTER;
  });

  useEffect(() => {
    try {
      localStorage.setItem('girokgyeol_roster', JSON.stringify(roster));
    } catch (e) {
      console.error('Failed to save roster to localStorage:', e);
    }
  }, [roster]);

  // Handler to add a record to the class roster
  const handleAddToRoster = (newRecord: StudentRecord) => {
    setRoster((prev) => [newRecord, ...prev]);
  };

  // Handler to remove a record from the class roster
  const handleRemoveFromRoster = (id: string) => {
    setRoster((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-ruled-paper flex flex-col font-sans text-[#1b2a4a]">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        rosterCount={roster.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'setuk' ? (
          <TabSetukHelper
            roster={roster}
            onAddToRoster={handleAddToRoster}
            onRemoveFromRoster={handleRemoveFromRoster}
          />
        ) : (
          <TabRubricGenerator />
        )}
      </main>

      {/* Rule Guide Reference Modal */}
      <RuleGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Official Document Footer */}
      <footer className="no-print border-t border-[#dcd7cb] bg-[#1b2a4a] text-[#dcd7ca] py-6 px-4 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-serif-doc font-bold text-sm text-[#f7f5ef]">
            기록결 (記錄結) - 대한민국 고등학교 교사용 생활기록부 작성 보조 및 검증 시스템
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            본 시스템은 선생님의 직접 관찰 사실을 규정에 부합하도록 구조화하며, 자의적 세특 창작을 하지 않습니다.
            <br />
            글자수 바이트 계산(한글 3B, 영문/숫자 2B, 공백 1B), NEIS 기재 금지어 스캔, 2-gram Jaccard 학급 중복도 검증을 수행합니다.
          </p>
          <p className="text-slate-500 text-[10px] pt-2 font-mono-code">
            © 2026 기록결 (Gi-rok-gyeol). Pure Client-Side Teacher Support Tool.
          </p>
        </div>
      </footer>
    </div>
  );
}
