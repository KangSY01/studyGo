/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  FileCheck2, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Users, 
  X 
} from 'lucide-react';
import { TeacherProfile, ViewState } from '../types';

interface SidebarNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  teacherProfile: TeacherProfile;
  rosterCount: number;
  onOpenGuideModal: () => void;
  onLogout: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentView,
  onNavigate,
  teacherProfile,
  rosterCount,
  onOpenGuideModal,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    {
      id: 'dashboard' as ViewState,
      label: '대시보드 (홈)',
      icon: LayoutDashboard,
      description: '작성 요약 및 최근 검증 현황'
    },
    {
      id: 'setuk' as ViewState,
      label: '세특 작성 보조 및 검증',
      icon: FileCheck2,
      description: '관찰사실 조립, 바이트/금지어/중복 스캔'
    },
    {
      id: 'rubric' as ViewState,
      label: '수행평가 문항·Rubric 생성',
      icon: Sparkles,
      description: '성취기준 연계 3단계 채점기준표'
    },
    {
      id: 'roster' as ViewState,
      label: '학급 명단 관리',
      icon: Users,
      badge: `${rosterCount}명`,
      description: '등록 학생 세특 모음 및 TXT 내보내기'
    }
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#1b2a4a] text-[#f7f5ef] border-b-4 border-[#b8433d] p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded border border-white bg-[#b8433d] flex items-center justify-center font-serif-doc text-white font-bold text-sm shadow-inner">
            結
          </div>
          <span className="font-serif-doc font-bold text-lg">기록결</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded bg-[#2e4066] text-white hover:bg-[#3d5588] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Container (Desktop Fixed + Mobile Collapsible) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1b2a4a] text-[#f7f5ef] border-r-4 border-[#b8433d] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Header */}
        <div>
          <div className="p-5 border-b border-[#2e4066] flex items-center space-x-3">
            <div className="w-10 h-10 rounded border-2 border-[#f7f5ef] bg-[#b8433d] flex items-center justify-center font-serif-doc text-white font-bold text-lg shadow-inner flex-shrink-0 select-none">
              結
            </div>
            <div>
              <h1 className="text-xl font-black font-serif-doc tracking-tight text-[#f7f5ef]">
                기록결 <span className="text-xs text-slate-300 font-sans font-normal">(記錄結)</span>
              </h1>
              <p className="text-[11px] text-[#d4cebd]">고교 교사 검증 도구</p>
            </div>
          </div>

          {/* Teacher Profile Pill */}
          <div className="p-4 mx-3 my-3 rounded bg-[#24355a] border border-[#354b7a] flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#3b5282] border border-[#5571aa] flex items-center justify-center text-white flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden text-xs">
              <div className="font-bold text-white truncate font-serif-doc">
                {teacherProfile.name}
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                {teacherProfile.school}
              </div>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-md text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#b8433d] text-white font-bold shadow-sm'
                      : 'text-[#dcd7ca] hover:bg-[#25375d] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#b0a998]'}`} />
                    <span className="text-xs font-serif-doc font-semibold">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-mono-code font-bold rounded-full bg-[#131f38] text-white border border-[#3e5380]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Guide Modal & Logout */}
        <div className="p-4 border-t border-[#2e4066] space-y-2 bg-[#14203a]">
          <button
            onClick={() => {
              onOpenGuideModal();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2 px-3 rounded bg-[#24355a] hover:bg-[#314777] text-xs text-[#dcd7ca] border border-[#354b7a] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>NEIS 기재 규정 가이드</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded bg-transparent hover:bg-rose-900/30 text-xs text-slate-400 hover:text-rose-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>

          <div className="pt-2 text-[10px] text-center text-slate-400 font-mono-code flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>AI 미창작 · 오직 사실 검증</span>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        ></div>
      )}
    </>
  );
};
