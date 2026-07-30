/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  ChevronUp, 
  ExternalLink, 
  FileText, 
  HelpCircle, 
  Lock, 
  LogIn, 
  Search, 
  ShieldCheck, 
  X 
} from 'lucide-react';

interface LandingPageProps {
  onGoToLogin: () => void;
  onOpenGuideModal: () => void;
}

interface BannerSlide {
  id: number;
  numStr: string;
  text: string;
  image: string;
  alt: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    numStr: '01',
    text: '기록결은 성취기준 기반 세특·수행평가 작성을 지원하는 교사용 검증 시스템입니다.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1600&auto=format&fit=crop',
    alt: '교사 연구 노트 및 서류'
  },
  {
    id: 2,
    numStr: '02',
    text: 'AI는 문장을 생성하지 않으며, 선생님이 입력한 사실을 정리·검증합니다.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop',
    alt: '고등학교 교실 환경'
  },
  {
    id: 3,
    numStr: '03',
    text: '2026학년도 학교생활기록부 기재요령 개정 사항이 반영되어 있습니다.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop',
    alt: '교육부 기재요령 학술 문헌'
  }
];

interface NoticeItem {
  id: string;
  category: 'POLICY' | 'UPDATE' | 'GENERAL';
  categoryLabel: string;
  title: string;
  date: string;
  isNew?: boolean;
  content: string;
}

interface AchievementStandard {
  subject: string;
  code: string;
  title: string;
}

const SAMPLE_NOTICES: NoticeItem[] = [
  {
    id: 'n1',
    category: 'POLICY',
    categoryLabel: '정책 변경',
    title: '2026학년도 학교생활기록부 기재요령 개정 사항 반영 안내',
    date: '2026.07.30',
    isNew: true,
    content: '2026학년도 고등학교 학교생활기록부 기재요령 개정안에 따라 NEIS 기재 금지어 데이터베이스 및 바이트 산정 기준(한글 3바이트, 영문/숫자 2바이트)이 최신화되었습니다. 교외 수상실적, 어학성적, 부모 직업 관련 언급 금지 조항이 엄격히 적용됩니다.'
  },
  {
    id: 'n2',
    category: 'POLICY',
    categoryLabel: '정책 변경',
    title: '유사도 검사 경고 기준값 조정 안내 (40% → 35%)',
    date: '2026.07.28',
    isNew: true,
    content: '학급 내 학생 간 세부능력 및 특기사항 유사도 검사 경고 기준값이 기존 40%에서 35%로 조정되었습니다. 2-gram Jaccard 계수 알고리즘을 통해 동일하거나 유사한 관찰 문장이 다수 발견될 경우 검토 필요 인장이 표시됩니다.'
  },
  {
    id: 'n3',
    category: 'UPDATE',
    categoryLabel: '기능 업데이트',
    title: '수행평가 Rubric 생성 기능에 \'토론\' 평가 방식 추가',
    date: '2026.07.20',
    content: '2022 개정 교육과정 성취기준 연계 수행평가 Rubric 도구에 기존 보고서, 발표, 논술형, 실험실습 외 \'토론\' 평가 방식이 새로 추가되었습니다. 입론, 반론, 최종발언 등 토론 특화 3단계 채점기준표를 자동 생성할 수 있습니다.'
  },
  {
    id: 'n4',
    category: 'UPDATE',
    categoryLabel: '기능 업데이트',
    title: '학급 명단 전체 내보내기(TXT) 기능 추가',
    date: '2026.07.15',
    content: '등록된 학급 세특 기록 전체를 개별 또는 일괄로 TXT 텍스트 파일 형태로 내보내기(다운로드)할 수 있는 기능이 학급 명단 관리 페이지에 추가되었습니다.'
  },
  {
    id: 'n5',
    category: 'GENERAL',
    categoryLabel: '일반 안내',
    title: '하계 방학 중 서비스 작동 및 세특 데이터 안전성 안내',
    date: '2026.07.01',
    content: '\'기록결\' 서비스는 순수 클라이언트 기반으로 작동하여 교사의 개인정보 및 세특 입력 데이터가 외부 서버로 송신되지 않고 웹브라우저에 안전하게 보관됩니다. 방학 중 브라우저 쿠키/캐시 삭제 시 유의하시기 바랍니다.'
  }
];

const SAMPLE_STANDARDS: AchievementStandard[] = [
  { subject: '공통국어1', code: '[10국01-02]', title: '매체에 나타난 정보의 신뢰성과 타당성을 평가하며 읽는다.' },
  { subject: '공통국어1', code: '[10국02-01]', title: '주제와 목적, 청자를 고려하여 논리적으로 설득하는 글을 쓴다.' },
  { subject: '공통수학1', code: '[10수01-03]', title: '다항식의 인수분해를 이해하고 복잡한 식을 체계적으로 탐구한다.' },
  { subject: '공통수학1', code: '[10수02-01]', title: '이차방정식과 이차함수의 관계를 이해하고 맥락에 맞게 활용한다.' },
  { subject: '통합사회', code: '[10통사01-01]', title: '인간, 사회, 환경을 바라보는 시·공간적 및 사회적 관점을 이해한다.' },
  { subject: '통합사회', code: '[10통사03-02]', title: '자원 배분의 효율성과 형평성을 고려하여 합리적 경제 의사결정을 내린다.' },
  { subject: '통합과학', code: '[10통과01-01]', title: '우주 초기 원소의 생성 과정을 스펙트럼 분석을 통해 추론한다.' },
  { subject: '통합과학', code: '[10통과03-02]', title: '생물 다양성의 중요성을 이해하고 자원 보전 방안을 탐구한다.' },
  { subject: '공통영어1', code: '[10영01-02]', title: '일상적인 주제에 관한 다양한 담화를 듣고 맥락과 요지를 파악한다.' },
  { subject: '한국사', code: '[10한02-01]', title: '근대 국가 수립 운동의 전개 과정과 개화기 사상의 의의를 평가한다.' },
  { subject: '정보', code: '[10정02-03]', title: '실생활 문제를 해결하기 위한 알고리즘을 설계하고 프로그래밍 언어로 구현한다.' },
  { subject: '물리학', code: '[12물101-01]', title: '물체의 운동을 위치, 속도, 가속도를 사용하여 수학적·물리적으로 설명한다.' }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onOpenGuideModal
}) => {
  const [selectedNoticeTab, setSelectedNoticeTab] = useState<'ALL' | 'POLICY' | 'UPDATE'>('ALL');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>('n1');
  const [standardSearch, setStandardSearch] = useState<string>('');
  const [activeModal, setActiveModal] = useState<'FAQ' | 'MANUAL' | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Auto transition banner slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  // Filter Notices
  const filteredNotices = SAMPLE_NOTICES.filter((item) => {
    if (selectedNoticeTab === 'POLICY') return item.category === 'POLICY';
    if (selectedNoticeTab === 'UPDATE') return item.category === 'UPDATE';
    return true;
  });

  // Filter Achievement Standards
  const filteredStandards = SAMPLE_STANDARDS.filter((st) => {
    if (!standardSearch.trim()) return true;
    const query = standardSearch.toLowerCase();
    return (
      st.subject.toLowerCase().includes(query) ||
      st.code.toLowerCase().includes(query) ||
      st.title.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-ruled-paper flex flex-col text-[#1b2a4a] font-sans">
      {/* Intranet Header & Navigation */}
      <header className="bg-[#1b2a4a] text-[#f7f5ef] border-b-4 border-[#b8433d] shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between py-2.5 gap-2 sm:gap-0">
          {/* Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded border border-[#f7f5ef] bg-[#b8433d] flex items-center justify-center font-serif-doc text-white font-bold text-base shadow-inner select-none">
              結
            </div>
            <span className="text-xl font-black font-serif-doc tracking-tight text-[#f7f5ef]">
              기록결 <span className="text-xs text-slate-300 font-sans font-normal">(記錄結)</span>
            </span>
          </div>

          {/* Intranet Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-6 text-xs font-serif-doc font-bold text-[#dcd7ca]">
            <button
              onClick={() => {}}
              className="px-2.5 py-1 rounded bg-[#273d6b] text-white border-b-2 border-[#b8433d] transition-colors cursor-pointer"
            >
              홈
            </button>
            <button
              onClick={onGoToLogin}
              className="px-2 py-1 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>세특 작성</span>
              <Lock className="w-3 h-3 text-amber-400" />
            </button>
            <button
              onClick={onGoToLogin}
              className="px-2 py-1 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>수행평가</span>
              <Lock className="w-3 h-3 text-amber-400" />
            </button>
            <button
              onClick={() => setActiveModal('MANUAL')}
              className="px-2 py-1 hover:text-white transition-colors cursor-pointer"
            >
              자료실
            </button>
          </nav>

          {/* Login Action Button */}
          <div>
            <button
              onClick={onGoToLogin}
              className="px-3.5 py-1.5 rounded bg-[#b8433d] hover:bg-[#a23832] text-white font-serif-doc font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-300" />
              <span>교사 로그인</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Image Banner Slider (PLATO System Style) */}
      <section className="w-full bg-[#1b2a4a] relative overflow-hidden border-b-2 border-[#b8433d] shadow-md select-none">
        <div className="relative h-60 sm:h-72 lg:h-[310px] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Background Images with Fade Transition */}
          {BANNER_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
              />
              {/* Dark Tint & Gradient Overlay for Pure Contrast & Institutional Tone */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1b2a4a]/90 via-[#1b2a4a]/75 to-[#1b2a4a]/65" />
            </div>
          ))}

          {/* Banner Foreground Overlay Content */}
          <div className="relative z-20 h-full flex flex-col justify-between py-5 sm:py-7">
            {/* Slide Index Indicator (Top Left) */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs font-serif-doc">
                {BANNER_SLIDES.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all cursor-pointer font-bold font-mono-code ${
                        isActive
                          ? 'text-white border-b-2 border-[#b8433d] pb-0.5 text-sm'
                          : 'text-white/40 hover:text-white/70 text-xs'
                      }`}
                    >
                      {slide.numStr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matter-of-Fact Overlay Statement (Center Text) */}
            <div className="my-auto py-2 max-w-3xl">
              <p className="text-base sm:text-2xl lg:text-3xl font-serif-doc font-bold text-[#f7f5ef] tracking-tight leading-snug drop-shadow-md">
                {BANNER_SLIDES[currentSlide].text}
              </p>
            </div>

            {/* Bottom Row: Manual Control Arrows & System Sub-Label */}
            <div className="flex items-center justify-between text-xs text-[#dcd7ca]">
              <div className="text-[11px] font-serif-doc text-slate-300 opacity-90 hidden sm:block">
                교사 관찰 기반 세특 및 수행평가 행정 지원 체계
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center space-x-1.5 ml-auto">
                <button
                  onClick={handlePrevSlide}
                  aria-label="이전 슬라이드"
                  className="p-1.5 rounded bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer border border-white/20 backdrop-blur-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextSlide}
                  aria-label="다음 슬라이드"
                  className="p-1.5 rounded bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer border border-white/20 backdrop-blur-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Intranet Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top 2-Column Section: Equal Height Matching */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
          {/* Left Area (70%): Notice Board */}
          <section className="lg:col-span-7 flex flex-col h-full">
            <div className="doc-card rounded-lg overflow-hidden border border-[#c8d8c3] bg-white shadow-2xs flex flex-col h-full">
              {/* Notice Section Header */}
              <div className="bg-[#1b2a4a] text-[#f7f5ef] px-5 py-3.5 flex items-center justify-between border-b-2 border-[#b8433d] flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#b8433d]" />
                  <h2 className="font-serif-doc font-bold text-base tracking-tight">공지사항</h2>
                </div>

                {/* Notice Filter Tabs */}
                <div className="flex items-center space-x-1 text-xs">
                  <button
                    onClick={() => setSelectedNoticeTab('ALL')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-serif-doc ${
                      selectedNoticeTab === 'ALL'
                        ? 'bg-[#b8433d] text-white font-bold'
                        : 'text-[#dcd7ca] hover:bg-[#273d6b]'
                    }`}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => setSelectedNoticeTab('POLICY')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-serif-doc ${
                      selectedNoticeTab === 'POLICY'
                        ? 'bg-[#b8433d] text-white font-bold'
                        : 'text-[#dcd7ca] hover:bg-[#273d6b]'
                    }`}
                  >
                    정책 변경
                  </button>
                  <button
                    onClick={() => setSelectedNoticeTab('UPDATE')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-serif-doc ${
                      selectedNoticeTab === 'UPDATE'
                        ? 'bg-[#b8433d] text-white font-bold'
                        : 'text-[#dcd7ca] hover:bg-[#273d6b]'
                    }`}
                  >
                    기능 업데이트
                  </button>
                </div>
              </div>

              {/* Notice List Container */}
              <div className="divide-y divide-[#e5e0d3] bg-white flex-1 flex flex-col justify-between">
                {filteredNotices.slice(0, 5).map((notice) => {
                  const isExpanded = expandedNoticeId === notice.id;

                  return (
                    <div key={notice.id} className="transition-colors flex-1 flex flex-col justify-center">
                      {/* Notice Header Line */}
                      <button
                        onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                        className="w-full px-5 py-3.5 text-left flex items-center justify-between hover:bg-[#f4f8f3] cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-2">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded font-serif-doc flex-shrink-0 ${
                              notice.category === 'POLICY'
                                ? 'bg-rose-100 text-rose-800'
                                : notice.category === 'UPDATE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {notice.categoryLabel}
                          </span>

                          <span className="text-xs font-bold font-serif-doc text-[#1b2a4a] truncate">
                            {notice.title}
                          </span>

                          {notice.isNew && (
                            <span className="px-1.5 py-0.2 bg-[#b8433d] text-white text-[10px] font-bold rounded flex-shrink-0">
                              N
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 flex-shrink-0 text-slate-400 text-xs font-mono-code">
                          <span>{notice.date}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#1b2a4a]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Notice Expanded Detail */}
                      {isExpanded && (
                        <div className="px-5 py-4 bg-ruled-light border-t border-b border-[#e5e0d3] text-xs text-slate-700 leading-relaxed font-sans space-y-2">
                          <p className="whitespace-pre-line">{notice.content}</p>
                          <div className="pt-2 text-[11px] text-slate-500 font-serif-doc flex items-center justify-between border-t border-[#d8e5d2]">
                            <span>게시일: {notice.date} | 교사 세특 검증지원센터</span>
                            <button
                              onClick={onGoToLogin}
                              className="text-[#b8433d] hover:underline font-bold cursor-pointer"
                            >
                              관련 도구 이동 →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Right Area (30%): Quick Links Sidebar */}
          <aside className="lg:col-span-3 flex flex-col h-full">
            <div className="doc-card rounded-lg overflow-hidden border border-[#c8d8c3] bg-white shadow-2xs flex flex-col h-full">
              <div className="bg-[#1b2a4a] text-[#f7f5ef] px-4 py-3.5 border-b-2 border-[#b8433d] flex-shrink-0">
                <h3 className="font-serif-doc font-bold text-sm tracking-tight">바로가기</h3>
              </div>

              <div className="p-2 divide-y divide-[#e5e0d3] text-xs font-serif-doc flex-1 flex flex-col justify-between">
                {/* Link 1: 세특 작성 (Lock) */}
                <button
                  onClick={onGoToLogin}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#f4f8f3] text-[#1b2a4a] text-left transition-colors cursor-pointer flex-1"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="font-bold">세특 작성 및 검증</span>
                  </div>
                  <span className="text-[10px] text-slate-400">로그인 필요</span>
                </button>

                {/* Link 2: 수행평가 (Lock) */}
                <button
                  onClick={onGoToLogin}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#f4f8f3] text-[#1b2a4a] text-left transition-colors cursor-pointer flex-1"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="font-bold">수행평가 문항·Rubric 생성</span>
                  </div>
                  <span className="text-[10px] text-slate-400">로그인 필요</span>
                </button>

                {/* Link 3: 학급 명단 (Lock) */}
                <button
                  onClick={onGoToLogin}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#f4f8f3] text-[#1b2a4a] text-left transition-colors cursor-pointer flex-1"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="font-bold">학급 명단 관리</span>
                  </div>
                  <span className="text-[10px] text-slate-400">로그인 필요</span>
                </button>

                {/* Link 4: NEIS 포털 (External) */}
                <a
                  href="https://star.moe.go.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-3 flex items-center justify-between hover:bg-[#f4f8f3] text-[#1b2a4a] text-left transition-colors flex-1"
                >
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#5f7a52] flex-shrink-0" />
                    <span>NEIS 학교생활기록부 포털</span>
                  </div>
                  <span className="text-[10px] text-slate-400">외부링크</span>
                </a>

                {/* Link 5: 기재요령 다운로드 (Modal) */}
                <button
                  onClick={onOpenGuideModal}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#f4f8f3] text-[#1b2a4a] text-left transition-colors cursor-pointer flex-1"
                >
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#5f7a52] flex-shrink-0" />
                    <span>교육부 기재요령 열람</span>
                  </div>
                  <span className="text-[10px] text-slate-400">가이드</span>
                </button>

                {/* Link 6: FAQ */}
                <button
                  onClick={() => setActiveModal('FAQ')}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#f4f8f3] text-[#1b2a4a] text-left transition-colors cursor-pointer flex-1"
                >
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>자주 묻는 질문(FAQ)</span>
                  </div>
                </button>

                {/* Link 7: 이용 매뉴얼 */}
                <button
                  onClick={() => setActiveModal('MANUAL')}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#f4f8f3] text-[#1b2a4a] text-left transition-colors cursor-pointer flex-1"
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>이용 매뉴얼</span>
                  </div>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Full-Width Section: Achievement Standards Search */}
        <section className="space-y-4">
          {/* Header Card */}
          <div className="doc-card rounded-lg overflow-hidden border border-[#c8d8c3] bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded bg-[#1b2a4a] text-white flex items-center justify-center font-bold flex-shrink-0 shadow-2xs border border-[#b8433d]">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-serif-doc font-bold text-base text-[#1b2a4a]">
                    오늘의 성취기준 검색
                  </h2>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded font-bold font-serif-doc">
                    자유 검색
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  2022 개정 교육과정 고등학교 주요 과목별 성취기준 및 세부 코드 통합 검색
                </p>
              </div>
            </div>

            {/* Free Search Input Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={standardSearch}
                onChange={(e) => setStandardSearch(e.target.value)}
                placeholder="과목, 코드, 단어 검색 (예: 국어, 함수, 10국01)..."
                className="w-full text-xs pl-9 pr-8 py-2 border border-[#b2cca8] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#1b2a4a] shadow-2xs font-sans"
              />
              {standardSearch && (
                <button
                  onClick={() => setStandardSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid of Achievement Standard Cards (1 col on mobile, 2 on tablet, 4 on desktop) */}
          {filteredStandards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredStandards.map((st, idx) => (
                <div
                  key={idx}
                  className="doc-card rounded-lg p-4 bg-white border border-[#c8d8c3] hover:border-[#1b2a4a] hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group cursor-default"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 border-b border-[#edf3ea] pb-2">
                      <span className="px-2 py-0.5 rounded bg-[#e2eee0] text-[#1b2a4a] border border-[#b2cca8] text-[11px] font-bold font-serif-doc flex-shrink-0">
                        {st.subject}
                      </span>
                      <span className="text-[11px] font-mono-code font-bold text-slate-500 group-hover:text-[#b8433d] transition-colors">
                        {st.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans line-clamp-3">
                      {st.title}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#edf3ea] flex items-center justify-between text-[11px] font-serif-doc text-slate-400">
                    <span>2022 개정 교육과정</span>
                    <button
                      onClick={onGoToLogin}
                      className="text-[#5f7a52] group-hover:text-[#1b2a4a] group-hover:underline font-bold cursor-pointer transition-colors"
                    >
                      Rubric 생성 →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="doc-card rounded-lg bg-white border border-[#c8d8c3] py-10 px-4 text-center space-y-2 shadow-2xs">
              <p className="text-xs font-bold text-[#1b2a4a] font-serif-doc">
                검색 조건에 해당되는 성취기준이 없습니다.
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                다른 과목명(국어, 수학, 사회, 과학, 영어, 정보)이나 키워드(함수, 원소, 매체 등)를 검색해 보세요.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#dcd7cb] bg-[#1b2a4a] text-[#dcd7ca] py-4 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto space-y-1">
          <p className="font-serif-doc font-bold text-xs text-[#f7f5ef]">
            기록결 (記錄結) - 고등학교 교사용 생활기록부 검증 및 행정 보조 시스템
          </p>
          <p className="text-slate-400 text-[10px]">
            © 2026 기록결. Pure Client-Side Official High School Teacher Intranet Portal.
          </p>
        </div>
      </footer>

      {/* FAQ Modal */}
      {activeModal === 'FAQ' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-[#1b2a4a] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3 border-[#1b2a4a]">
              <h3 className="font-serif-doc font-bold text-base text-[#1b2a4a]">
                자주 묻는 질문 (FAQ)
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 max-h-80 overflow-y-auto pr-1">
              <div className="p-3 rounded bg-ruled-light border border-[#c8d8c3] space-y-1">
                <div className="font-bold text-[#1b2a4a]">Q. 입력된 세특 문장이 서버로 저장되나요?</div>
                <div>A. 아닙니다. '기록결'은 순수 브라우저 내부에서만 실행되며 교사의 입력 데이터는 외부 서버로 일절 전송되지 않습니다.</div>
              </div>

              <div className="p-3 rounded bg-ruled-light border border-[#c8d8c3] space-y-1">
                <div className="font-bold text-[#1b2a4a]">Q. NEIS 글자수 바이트 계산 기준은 무엇인가요?</div>
                <div>A. NEIS 실제 검증 로직에 맞춰 한글 1글자=3바이트, 영문·숫자·특수문자=2바이트, 공백=1바이트로 정확히 산정합니다.</div>
              </div>

              <div className="p-3 rounded bg-ruled-light border border-[#c8d8c3] space-y-1">
                <div className="font-bold text-[#1b2a4a]">Q. 학급 중복도(유사도) 검사는 어떻게 작동하나요?</div>
                <div>A. 등록된 학급 학생 간 문장을 2-gram 단어조합으로 분석하여 동일·유사 패턴 비율이 35% 이상일 때 경고를 표시합니다.</div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-[#1b2a4a] text-white text-xs font-serif-doc font-bold rounded hover:bg-[#283e6b] cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Manual Modal */}
      {activeModal === 'MANUAL' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-[#1b2a4a] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3 border-[#1b2a4a]">
              <h3 className="font-serif-doc font-bold text-base text-[#1b2a4a]">
                기록결 이용 매뉴얼
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 max-h-80 overflow-y-auto">
              <ol className="list-decimal pl-4 space-y-2 leading-relaxed font-sans">
                <li><strong>교사 로그인:</strong> 소속 및 이메일 입력 후 대시보드 진입</li>
                <li><strong>세특 작성 보조:</strong> 과목 선택 → 학생 관찰 내역(과제, 역량, 성장 모습) 입력 → 문장 조립 실행</li>
                <li><strong>규정 자동 검증:</strong> NEIS 글자수 바이트, 기재 금지어, 학급 중복 유사도 스캔 결과 확인 후 복사</li>
                <li><strong>Rubric 생성:</strong> 성취기준 입력 → 3단계 채점기준표 도출 후 공문서 출력/복사</li>
              </ol>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-[#1b2a4a] text-white text-xs font-serif-doc font-bold rounded hover:bg-[#283e6b] cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
