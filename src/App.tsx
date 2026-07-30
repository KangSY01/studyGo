/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { StudentRecord, TeacherProfile, ViewState } from './types';
import { INITIAL_CLASS_ROSTER } from './data/mockData';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SidebarNav } from './components/SidebarNav';
import { DashboardHome } from './components/DashboardHome';
import { TabSetukHelper } from './components/TabSetukHelper';
import { TabRubricGenerator } from './components/TabRubricGenerator';
import { ClassRosterPage } from './components/ClassRosterPage';
import { RuleGuideModal } from './components/RuleGuideModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authenticated teacher profile state
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem('girokgyeol_teacher');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load teacher profile:', e);
    }
    return null;
  });

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

  // Handle Login success
  const handleLoginSuccess = (profile: TeacherProfile) => {
    setTeacherProfile(profile);
    sessionStorage.setItem('girokgyeol_teacher', JSON.stringify(profile));
    setCurrentView('dashboard');
    showToast(`${profile.name}님 환영합니다! 대시보드로 이동했습니다.`);
  };

  // Handle Logout
  const handleLogout = () => {
    setTeacherProfile(null);
    sessionStorage.removeItem('girokgyeol_teacher');
    setCurrentView('landing');
    showToast('로그아웃 되었습니다.');
  };

  // Handler to add a record to the class roster
  const handleAddToRoster = (newRecord: StudentRecord) => {
    setRoster((prev) => [newRecord, ...prev]);
    showToast(`${newRecord.studentName} 학생 세특이 학급 명단에 저장되었습니다.`);
  };

  // Handler to remove a record from the class roster
  const handleRemoveFromRoster = (id: string) => {
    setRoster((prev) => prev.filter((item) => item.id !== id));
    showToast('해당 세특 기록을 명단에서 삭제했습니다.');
  };

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('클립보드에 문장이 복사되었습니다!');
  };

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Render Landing View
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onGoToLogin={() => setCurrentView('login')}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
        />
        <RuleGuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
      </>
    );
  }

  // Render Login View
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoBack={() => setCurrentView('landing')}
      />
    );
  }

  // Fallback teacher profile if accessed directly
  const activeTeacher: TeacherProfile = teacherProfile || {
    name: '김성식 교사',
    school: '한국고등학교 1학년 부장',
    email: 'teacher@korea.hs.kr'
  };

  // Render Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-ruled-paper flex flex-col font-sans text-[#1b2a4a]">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md bg-[#1b2a4a] text-white text-xs font-bold font-serif-doc shadow-2xl border-2 border-[#b8433d] flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Workspace with Fixed Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar Nav Component */}
        <SidebarNav
          currentView={currentView}
          onNavigate={(v) => setCurrentView(v)}
          teacherProfile={activeTeacher}
          rosterCount={roster.length}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {currentView === 'dashboard' && (
              <DashboardHome
                teacherProfile={activeTeacher}
                roster={roster}
                onNavigate={(v) => setCurrentView(v)}
                onCopyText={handleCopyText}
              />
            )}

            {currentView === 'setuk' && (
              <TabSetukHelper
                roster={roster}
                onAddToRoster={handleAddToRoster}
                onRemoveFromRoster={handleRemoveFromRoster}
              />
            )}

            {currentView === 'rubric' && <TabRubricGenerator />}

            {currentView === 'roster' && (
              <ClassRosterPage
                roster={roster}
                onRemoveFromRoster={handleRemoveFromRoster}
                onNavigate={(v) => setCurrentView(v)}
                onCopyText={handleCopyText}
              />
            )}
          </div>
        </main>
      </div>

      {/* Rule Guide Reference Modal */}
      <RuleGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Official Document Footer */}
      <footer className="no-print border-t border-[#dcd7cb] bg-[#1b2a4a] text-[#dcd7ca] py-6 px-4 lg:pl-64 text-center text-xs">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-serif-doc font-bold text-sm text-[#f7f5ef]">
            기록결 (記錄結) - 고등학교 교사용 생활기록부 작성 보조 및 검증 시스템
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            본 시스템은 선생님의 직접 관찰 사실을 규정에 부합하도록 구조화하며, 자의적 세특 창작을 하지 않습니다.
            <br />
            글자수 바이트 계산(한글 3B, 영문/숫자 2B, 공백 1B), NEIS 기재 금지어 스캔, 2-gram Jaccard 학급 중복도 검증을 수행합니다.
          </p>
          <p className="text-slate-500 text-[10px] pt-1 font-mono-code">
            © 2026 기록결 (Gi-rok-gyeol). Pure Client-Side Official High School Teacher Utility.
          </p>
        </div>
      </footer>
    </div>
  );
}
