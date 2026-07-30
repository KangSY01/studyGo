/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Lock, LogIn, Mail, School, ShieldCheck } from 'lucide-react';
import { TeacherProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (profile: TeacherProfile) => void;
  onGoBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoBack
}) => {
  const [email, setEmail] = useState<string>('kim.teacher@korea.hs.kr');
  const [password, setPassword] = useState<string>('teacher1234');
  const [teacherName, setTeacherName] = useState<string>('김성식 교사');
  const [schoolName, setSchoolName] = useState<string>('한국고등학교 1학년 부장');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: teacherName || '김성식 교사',
      school: schoolName || '한국고등학교',
      email: email || 'teacher@korea.hs.kr'
    });
  };

  return (
    <div className="min-h-screen bg-ruled-paper flex flex-col justify-between text-[#1b2a4a]">
      {/* Top Header */}
      <header className="bg-[#1b2a4a] text-[#f7f5ef] border-b-4 border-[#b8433d] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onGoBack}
            className="inline-flex items-center space-x-1.5 text-xs text-[#dcd7ca] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인으로 돌아가기</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded border border-white bg-[#b8433d] flex items-center justify-center font-serif-doc text-white font-bold text-sm">
              結
            </div>
            <span className="font-serif-doc font-bold text-base text-white">기록결</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md doc-card rounded-lg overflow-hidden border-2 border-[#1b2a4a] bg-white shadow-xl animate-fadeIn">
          {/* Card Header */}
          <div className="bg-[#1b2a4a] text-[#f7f5ef] p-6 text-center border-b-2 border-[#b8433d]">
            <div className="w-12 h-12 rounded-full bg-[#b8433d] border-2 border-white mx-auto flex items-center justify-center mb-3 shadow-inner font-serif-doc text-xl font-bold text-white">
              結
            </div>
            <h2 className="text-xl font-black font-serif-doc tracking-tight text-[#f7f5ef]">
              고등학교 교사 접속 인증
            </h2>
            <p className="text-xs text-[#d4cebd] mt-1">
              선생님 계정으로 접속하여 세특 검증 대시보드를 이용합니다
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 bg-ruled-light space-y-4">
            {/* Teacher Name Input */}
            <div>
              <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                성함 및 소속 (데모용)
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="예: 김성식 교사"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-[#c8c2b4] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#1b2a4a]"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                교직원 이메일
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@korea.hs.kr"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-[#c8c2b4] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#1b2a4a] font-mono-code"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-[#c8c2b4] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#1b2a4a] font-mono-code"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 rounded bg-[#1b2a4a] hover:bg-[#283e6b] text-white font-serif-doc font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>교사 대시보드 로그인</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2.5 rounded bg-[#f0ebd9] hover:bg-[#e4ddc8] text-[#1b2a4a] border border-[#c8c2b4] font-serif-doc font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#b8433d]" />
                <span>학교 / 교육청 통합 계정 간편 로그인</span>
              </button>
            </div>

            {/* Notice Box */}
            <div className="p-3 rounded bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                데모 인증 화면입니다. 임의의 값을 입력하거나 "로그인" 버튼을 누르시면 교사 대시보드로 즉시 이동합니다.
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#dcd7cb] bg-[#1b2a4a] text-[#dcd7ca] py-4 px-4 text-center text-xs">
        <p className="font-serif-doc">© 2026 기록결 (記錄結). All Rights Reserved.</p>
      </footer>
    </div>
  );
};
