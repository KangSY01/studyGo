/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Download, 
  Edit3, 
  FileText, 
  MessageSquare,
  Mic,
  MicOff,
  Plus, 
  RefreshCw, 
  RotateCcw, 
  Search, 
  Send,
  Sparkles,
  Trash2, 
  UserPlus, 
  Users 
} from 'lucide-react';
import { AchievementLevel, StudentInputForm, StudentRecord, VerificationResult } from '../types';
import { SAMPLE_STUDENT_PRESETS } from '../data/mockData';
import { 
  assembleStudentRecordText, 
  calculateKoreanBytes, 
  checkClassDuplicateSimilarity, 
  scanProhibitedTerms 
} from '../utils/textAnalysis';
import { Stamp } from './Stamp';

interface TabSetukHelperProps {
  roster: StudentRecord[];
  onAddToRoster: (record: StudentRecord) => void;
  onRemoveFromRoster: (id: string) => void;
}

const DEFAULT_FORM: StudentInputForm = {
  subject: '통합사회',
  customSubject: '',
  achievementLevel: '상',
  studentName: '김철수',
  taskTitle: '기후 변화와 이산화탄소 배출에 관한 탐구 보고서 작성',
  observedBehavior: '국가별 이산화탄소 배출 데이터를 수집하여 변수 간 상관관계를 시각화 그래프로 정교하게 구현하고 원인별 배출 영향을 계량적으로 분석함.',
  competency: '비판적 사고력 및 데이터 분석',
  growthAspect: '초기에는 단편적 자료 나열에 그쳤으나 오류 분석과 통계 검증을 거쳐 데이터에 기반한 논리적 결론을 도출하는 정교함을 갖춤.'
};

export const TabSetukHelper: React.FC<TabSetukHelperProps> = ({
  roster,
  onAddToRoster,
  onRemoveFromRoster
}) => {
  const [form, setForm] = useState<StudentInputForm>(DEFAULT_FORM);
  const [isCustomSubject, setIsCustomSubject] = useState<boolean>(false);

  // Active assembled text & verification result state
  const [assembledText, setAssembledText] = useState<string>('');
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [isEditingAssembled, setIsEditingAssembled] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [addedNotification, setAddedNotification] = useState<boolean>(false);

  // AI Polish State (윤문 제안)
  const [isPolishing, setIsPolishing] = useState<boolean>(false);
  const [polishSuggestions, setPolishSuggestions] = useState<string[] | null>(null);
  const [polishError, setPolishError] = useState<string | null>(null);

  // AI Paraphrase State (표현 다양화 제안)
  const [isParaphrasing, setIsParaphrasing] = useState<boolean>(false);
  const [paraphraseSuggestions, setParaphraseSuggestions] = useState<string[] | null>(null);
  const [paraphraseError, setParaphraseError] = useState<string | null>(null);

  // Search filter for roster
  const [rosterSearch, setRosterSearch] = useState<string>('');

  // Mode tab state ('detailed' vs 'quick')
  const [inputMode, setInputMode] = useState<'detailed' | 'quick'>('detailed');

  // Quick Input states
  const [quickRawText, setQuickRawText] = useState<string>('');
  const [isListeningQuick, setIsListeningQuick] = useState<boolean>(false);
  const [isListeningAnswerIdx, setIsListeningAnswerIdx] = useState<number | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const [isQuickAnalyzing, setIsQuickAnalyzing] = useState<boolean>(false);
  const [quickAnalyzeError, setQuickAnalyzeError] = useState<string | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<{ [key: number]: string }>({});
  const [previousAnalysis, setPreviousAnalysis] = useState<{
    activityName: string;
    observedBehavior: string;
    competency: string;
    growthAspect: string;
  } | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const handleToggleMicQuick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    if (isListeningQuick) {
      setIsListeningQuick(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListeningQuick(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setQuickRawText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsListeningQuick(false);
      };

      recognition.onend = () => {
        setIsListeningQuick(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed:', err);
      setIsListeningQuick(false);
    }
  };

  const handleToggleMicAnswer = (index: number) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    if (isListeningAnswerIdx === index) {
      setIsListeningAnswerIdx(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListeningAnswerIdx(index);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setQuestionAnswers((prev) => ({
          ...prev,
          [index]: prev[index] ? `${prev[index]} ${transcript}` : transcript,
        }));
      };

      recognition.onerror = () => {
        setIsListeningAnswerIdx(null);
      };

      recognition.onend = () => {
        setIsListeningAnswerIdx(null);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed for answer:', err);
      setIsListeningAnswerIdx(null);
    }
  };

  const handleQuickAnalyze = async (answerToQuestion?: string) => {
    if (!quickRawText.trim() && !answerToQuestion) return;

    setIsQuickAnalyzing(true);
    setQuickAnalyzeError(null);

    try {
      const res = await fetch('/api/gemini/quick-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: quickRawText,
          subject: effectiveSubject,
          previousAnalysis: previousAnalysis || undefined,
          answerToQuestion: answerToQuestion || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '빠른 입력 분석 실패');

      const updatedForm: StudentInputForm = {
        ...form,
        taskTitle: data.activityName || form.taskTitle,
        observedBehavior: data.observedBehavior || form.observedBehavior,
        competency: data.competency || form.competency,
        growthAspect: data.growthAspect || form.growthAspect
      };

      setForm(updatedForm);
      setPreviousAnalysis({
        activityName: data.activityName || '',
        observedBehavior: data.observedBehavior || '',
        competency: data.competency || '',
        growthAspect: data.growthAspect || ''
      });

      setFollowUpQuestions(data.followUpQuestions || []);
      setQuestionAnswers({});

      // Auto verify and assemble
      const assembled = assembleStudentRecordText({ ...updatedForm, subject: effectiveSubject });
      setAssembledText(assembled);
      const byteCount = calculateKoreanBytes(assembled);
      const isByteOver = byteCount > 1500;
      const prohibited = scanProhibitedTerms(assembled);
      const duplicate = checkClassDuplicateSimilarity(assembled, roster, undefined, 40);
      const isPass = !isByteOver && !prohibited.hasProhibited && !duplicate.isWarning;

      setVerification({
        status: isPass ? 'PASS' : 'REVIEW',
        byteCount,
        maxByteLimit: 1500,
        isByteOver,
        prohibited,
        duplicate,
        verifiedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err: any) {
      setQuickAnalyzeError(err.message || 'AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsQuickAnalyzing(false);
    }
  };

  const effectiveSubject = isCustomSubject
    ? form.customSubject || '기타 과목'
    : form.subject;

  // Handles "정리 및 검증하기" (Structure & Verify)
  const handleVerify = () => {
    // Reset AI suggestions when re-assembling
    setPolishSuggestions(null);
    setPolishError(null);
    setParaphraseSuggestions(null);
    setParaphraseError(null);

    // 1. Sentence Assembly from teacher inputs
    const assembled = assembleStudentRecordText({ ...form, subject: effectiveSubject });
    setAssembledText(assembled);

    // 2. Byte calculation
    const byteCount = calculateKoreanBytes(assembled);
    const maxByteLimit = 1500;
    const isByteOver = byteCount > maxByteLimit;

    // 3. Prohibited terms scan
    const prohibited = scanProhibitedTerms(assembled);

    // 4. Duplicate similarity check against roster
    const duplicate = checkClassDuplicateSimilarity(assembled, roster, undefined, 40);

    // 5. Determine overall status
    const isPass = !isByteOver && !prohibited.hasProhibited && !duplicate.isWarning;

    const verResult: VerificationResult = {
      status: isPass ? 'PASS' : 'REVIEW',
      byteCount,
      maxByteLimit,
      isByteOver,
      prohibited,
      duplicate,
      verifiedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setVerification(verResult);
    setIsEditingAssembled(false);
  };

  // Re-runs verification when teacher manually edits assembled text or applies suggestion
  const handleAssembledChange = (newText: string) => {
    setAssembledText(newText);
    const byteCount = calculateKoreanBytes(newText);
    const maxByteLimit = 1500;
    const isByteOver = byteCount > maxByteLimit;
    const prohibited = scanProhibitedTerms(newText);
    const duplicate = checkClassDuplicateSimilarity(newText, roster, undefined, 40);
    const isPass = !isByteOver && !prohibited.hasProhibited && !duplicate.isWarning;

    setVerification({
      status: isPass ? 'PASS' : 'REVIEW',
      byteCount,
      maxByteLimit,
      isByteOver,
      prohibited,
      duplicate,
      verifiedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Fetch AI Polish Suggestions from Gemini API
  const handleFetchPolishSuggestions = async () => {
    if (!assembledText) return;
    setIsPolishing(true);
    setPolishError(null);
    try {
      const res = await fetch('/api/gemini/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: assembledText, subject: effectiveSubject })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '윤문 제안 실패');
      setPolishSuggestions(data.suggestions || []);
    } catch (err: any) {
      setPolishError(err.message || 'AI 윤문 제안을 불러오지 못했습니다.');
    } finally {
      setIsPolishing(false);
    }
  };

  // Fetch AI Paraphrase Suggestions from Gemini API
  const handleFetchParaphraseSuggestions = async () => {
    if (!assembledText) return;
    setIsParaphrasing(true);
    setParaphraseError(null);
    try {
      const res = await fetch('/api/gemini/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: assembledText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '표현 다양화 제안 실패');
      setParaphraseSuggestions(data.suggestions || []);
    } catch (err: any) {
      setParaphraseError(err.message || 'AI 표현 다양화 제안을 불러오지 못했습니다.');
    } finally {
      setIsParaphrasing(false);
    }
  };

  // Apply chosen suggestion
  const handleApplySuggestion = (chosenText: string) => {
    handleAssembledChange(chosenText);
    setPolishSuggestions(null);
    setParaphraseSuggestions(null);
  };

  // Adds current record to class roster
  const handleSaveToRoster = () => {
    if (!verification || !assembledText) return;

    const newRecord: StudentRecord = {
      id: `std-${Date.now()}`,
      subject: effectiveSubject,
      achievementLevel: form.achievementLevel,
      studentName: form.studentName.trim() || '학생',
      taskTitle: form.taskTitle,
      observedBehavior: form.observedBehavior,
      competency: form.competency,
      growthAspect: form.growthAspect,
      assembledText,
      verification,
      createdAt: new Date().toISOString()
    };

    onAddToRoster(newRecord);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 2500);
  };

  // Copy assembled text to clipboard
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Preset sample loader
  const handleLoadPreset = (presetData: StudentInputForm) => {
    setForm(presetData);
    setIsCustomSubject(false);
    setVerification(null);
    setAssembledText('');
  };

  // Filtered Roster
  const filteredRoster = roster.filter(
    (item) =>
      item.studentName.includes(rosterSearch) ||
      item.subject.includes(rosterSearch) ||
      item.assembledText.includes(rosterSearch)
  );

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
    <div className="space-y-8">
      {/* Upper Grid: Input Form + Verification Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Teacher Observation Input Form (7 cols) */}
        <div className="lg:col-span-7 doc-card rounded-lg overflow-hidden border border-[#dcd7cb] bg-white">
          <div className="bg-[#1b2a4a] text-[#f7f5ef] px-5 py-3.5 flex items-center justify-between border-b-2 border-[#b8433d]">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#b8433d]" />
              <h2 className="font-serif-doc font-bold text-base">관찰 사실 및 역량 입력 양식</h2>
            </div>

            {/* Quick Preset Selector */}
            <div className="flex items-center space-x-2">
              <select
                onChange={(e) => {
                  const idx = parseInt(e.target.value);
                  if (!isNaN(idx) && SAMPLE_STUDENT_PRESETS[idx]) {
                    handleLoadPreset(SAMPLE_STUDENT_PRESETS[idx].data);
                  }
                }}
                defaultValue=""
                className="text-xs bg-[#2e4066] text-[#f7f5ef] border border-[#3e5380] rounded px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="" disabled>
                  ⚡ 예시 입력 불러오기
                </option>
                {SAMPLE_STUDENT_PRESETS.map((p, i) => (
                  <option key={i} value={i}>
                    {p.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setForm(DEFAULT_FORM);
                  setVerification(null);
                  setAssembledText('');
                }}
                title="입력 내용 초기화"
                className="p-1 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-4 bg-ruled-light">
            {/* Sub-tab Switcher: Detailed vs Quick Input */}
            <div className="flex border-b border-[#c8c2b4] pb-2 bg-slate-100/80 p-1.5 rounded-lg gap-2">
              <button
                type="button"
                onClick={() => setInputMode('detailed')}
                className={`flex-1 py-2 text-xs font-serif-doc font-bold rounded-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  inputMode === 'detailed'
                    ? 'bg-[#1b2a4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>상세 입력</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('quick')}
                className={`flex-1 py-2 text-xs font-serif-doc font-bold rounded-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  inputMode === 'quick'
                    ? 'bg-[#1b2a4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>빠른 입력 (AI 대화형)</span>
              </button>
            </div>

            {/* Common Student Info Header (Subject, Level, Name) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded border border-[#dcd7cb]">
              {/* Subject */}
              <div>
                <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                  과목 선택 <span className="text-rose-600">*</span>
                </label>
                {isCustomSubject ? (
                  <div className="flex space-x-1">
                    <input
                      type="text"
                      value={form.customSubject || ''}
                      onChange={(e) => setForm({ ...form, customSubject: e.target.value })}
                      placeholder="과목명 입력"
                      className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomSubject(false)}
                      className="px-2 text-xs border border-[#c8c2b4] rounded bg-slate-100 text-slate-700"
                    >
                      목록
                    </button>
                  </div>
                ) : (
                  <select
                    value={form.subject}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomSubject(true);
                      } else {
                        setForm({ ...form, subject: e.target.value });
                      }
                    }}
                    className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none cursor-pointer"
                  >
                    <option value="공통국어1">공통국어1</option>
                    <option value="공통수학1">공통수학1</option>
                    <option value="공통영어1">공통영어1</option>
                    <option value="통합사회">통합사회</option>
                    <option value="통합과학">통합과학</option>
                    <option value="CUSTOM">+ 직접 입력</option>
                  </select>
                )}
              </div>

              {/* Achievement Level */}
              <div>
                <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                  성취수준 <span className="text-rose-600">*</span>
                </label>
                <div className="flex space-x-1">
                  {(['상', '중', '하'] as AchievementLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setForm({ ...form, achievementLevel: lvl })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded border transition-colors cursor-pointer ${
                        form.achievementLevel === lvl
                          ? 'bg-[#1b2a4a] text-white border-[#1b2a4a]'
                          : 'bg-white text-slate-700 border-[#c8c2b4] hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                  학생 이름 <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="예: 김철수"
                  className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none"
                />
              </div>
            </div>

            {inputMode === 'detailed' ? (
              /* --- DETAILED INPUT MODE --- */
              <div className="space-y-4 pt-1">
                {/* Task Title */}
                <div>
                  <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                    활동 / 과제명
                  </label>
                  <input
                    type="text"
                    value={form.taskTitle}
                    onChange={(e) => setForm({ ...form, taskTitle: e.target.value })}
                    placeholder="예: 기후 변화와 이산화탄소 배출에 관한 탐구 보고서 작성"
                    className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none"
                  />
                </div>

                {/* Observed Behavior */}
                <div>
                  <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                    구체적으로 관찰한 행동 <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.observedBehavior}
                    onChange={(e) => setForm({ ...form, observedBehavior: e.target.value })}
                    placeholder="선생님께서 직접 관찰하신 사실에 기반하여 개별적 행동을 입력해 주세요. (예: 데이터 수집 후 시각화 그래프 구현 및 상관관계 분석함)"
                    className="w-full text-xs p-2.5 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Competency */}
                <div>
                  <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                    드러난 역량
                  </label>
                  <input
                    type="text"
                    value={form.competency}
                    onChange={(e) => setForm({ ...form, competency: e.target.value })}
                    placeholder="예: 비판적 사고력 및 데이터 분석 역량"
                    className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none"
                  />
                </div>

                {/* Growth & Change */}
                <div>
                  <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                    성장 / 변화 모습
                  </label>
                  <textarea
                    rows={2}
                    value={form.growthAspect}
                    onChange={(e) => setForm({ ...form, growthAspect: e.target.value })}
                    placeholder="수행 과정에서의 태도 변화, 깊어진 사고 또는 보완 노력 등을 입력해 주세요."
                    className="w-full text-xs p-2.5 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="w-full py-3 px-4 rounded bg-[#1b2a4a] hover:bg-[#283d6a] text-white font-serif-doc font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>관찰 내용 정리 및 규정 검증하기 (정리하기)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* --- QUICK CONVERSATIONAL INPUT MODE --- */
              <div className="space-y-4 pt-1 animate-fadeIn">
                {/* Disclaimer Banner */}
                <div className="p-3 rounded-md bg-amber-50/90 border border-amber-300 text-xs text-amber-900 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px] font-serif-doc">
                    ✨ AI는 선생님이 입력한 내용을 항목별로 정리하고, 부족한 부분은 질문으로 되물을 뿐 새로운 내용을 만들지 않습니다.
                  </p>
                </div>

                {/* Step 1: Free Text Input with Speech Mic Button */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a]">
                      1단계: 자유 입력 (텍스트 또는 음성 입력) <span className="text-rose-600">*</span>
                    </label>

                    {/* Microphone Toggle Button */}
                    <button
                      type="button"
                      onClick={handleToggleMicQuick}
                      disabled={!speechSupported}
                      title={
                        speechSupported
                          ? '음성 입력 시작/중지'
                          : '이 브라우저는 음성 입력을 지원하지 않습니다. 직접 입력해주세요'
                      }
                      className={`px-2.5 py-1 text-xs rounded-full font-serif-doc font-bold flex items-center space-x-1.5 transition-all cursor-pointer border ${
                        !speechSupported
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : isListeningQuick
                          ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-sm'
                          : 'bg-white text-[#1b2a4a] border-[#c8c2b4] hover:bg-slate-100'
                      }`}
                    >
                      {isListeningQuick ? (
                        <>
                          <Mic className="w-3.5 h-3.5 animate-bounce" />
                          <span>음성 인식 중... (말씀하세요)</span>
                        </>
                      ) : (
                        <>
                          {speechSupported ? <Mic className="w-3.5 h-3.5 text-rose-600" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{speechSupported ? '음성 입력' : '음성 미지원'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {!speechSupported && (
                    <p className="text-[11px] text-amber-800 bg-amber-50/70 px-2.5 py-1 rounded border border-amber-200">
                      ⚠️ 이 브라우저는 음성 입력을 지원하지 않습니다. 직접 입력해주세요.
                    </p>
                  )}

                  <div className="relative">
                    <textarea
                      rows={4}
                      value={quickRawText}
                      onChange={(e) => setQuickRawText(e.target.value)}
                      placeholder="학생에 대해 자유롭게 짧게 적어주세요. (예: 김철수 학생은 이번 사회 시간에 자원 배분 논술 활동에서 수치 데이터를 모아 상관관계를 시각화 그래프로 정교하게 분석하고 발표했음...)"
                      className="w-full text-xs p-3 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Step 2: Gemini Analysis Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleQuickAnalyze()}
                    disabled={isQuickAnalyzing || !quickRawText.trim()}
                    className="w-full py-3 px-4 rounded bg-[#1b2a4a] hover:bg-[#283d6a] text-white font-serif-doc font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isQuickAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                        <span>Gemini AI가 자유 메모를 항목별로 분석 중...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>자유 메모 분석하기 (AI 항목 자동 분류)</span>
                      </>
                    )}
                  </button>
                </div>

                {quickAnalyzeError && (
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {quickAnalyzeError}
                  </div>
                )}

                {/* Step 3: Follow-up Questions Speech Bubbles */}
                {followUpQuestions.length > 0 && (
                  <div className="p-3.5 rounded-lg bg-blue-50/90 border border-blue-200 space-y-3">
                    <div className="flex items-center space-x-2 border-b border-blue-200 pb-2">
                      <MessageSquare className="w-4 h-4 text-[#1b2a4a]" />
                      <span className="font-serif-doc font-bold text-xs text-[#1b2a4a]">
                        Gemini AI 추가 질문 (부족한 내용 구체화)
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      입력된 메모에서 일부 항목의 사실 관계가 모호합니다. 아래 질문에 짧게 답변해 주시면 항목을 더욱 정교하게 채워드립니다.
                    </p>

                    <div className="space-y-3">
                      {followUpQuestions.map((q, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-md border border-blue-200 space-y-2 shadow-2xs">
                          <div className="flex items-start space-x-2 text-xs font-bold text-slate-800">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-mono-code shrink-0 mt-0.5">
                              질문 {idx + 1}
                            </span>
                            <p className="leading-snug text-slate-800 font-sans">{q}</p>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <input
                              type="text"
                              value={questionAnswers[idx] || ''}
                              onChange={(e) => setQuestionAnswers({ ...questionAnswers, [idx]: e.target.value })}
                              placeholder="답변 입력 (예: 발표 전달력과 그래프 설명 방식이 매우 정교했음)"
                              className="flex-1 text-xs p-2 border border-[#c8c2b4] rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => handleToggleMicAnswer(idx)}
                              disabled={!speechSupported}
                              title={speechSupported ? "음성으로 답변하기" : "이 브라우저는 음성 입력을 지원하지 않습니다."}
                              className={`p-2 rounded transition-colors cursor-pointer border ${
                                !speechSupported
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : isListeningAnswerIdx === idx
                                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                                  : 'bg-white text-slate-700 border-[#c8c2b4] hover:bg-slate-100'
                              }`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const ansText = Object.values(questionAnswers).filter(Boolean).join('\n');
                        handleQuickAnalyze(ansText);
                      }}
                      disabled={isQuickAnalyzing || Object.values(questionAnswers).filter(Boolean).length === 0}
                      className="w-full py-2.5 px-3 rounded bg-[#b8433d] hover:bg-[#a23832] text-white font-serif-doc font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>답변 반영하기 (AI 항목 업데이트)</span>
                    </button>
                  </div>
                )}

                {/* Step 3: Extracted Fields Preview & Direct Edit */}
                {previousAnalysis && (
                  <div className="p-3.5 rounded-lg bg-white border border-[#dcd7cb] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#e5e0d3] pb-2">
                      <span className="font-serif-doc font-bold text-xs text-[#1b2a4a] flex items-center space-x-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>AI가 항목별로 정리한 내용 (상세 입력과 연동)</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        필요시 직접 수정하실 수 있습니다.
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-serif-doc font-bold text-[#1b2a4a] mb-1">
                          활동 / 과제명
                        </label>
                        <input
                          type="text"
                          value={form.taskTitle}
                          onChange={(e) => setForm({ ...form, taskTitle: e.target.value })}
                          className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-serif-doc font-bold text-[#1b2a4a] mb-1">
                          구체적으로 관찰한 행동
                        </label>
                        <textarea
                          rows={2}
                          value={form.observedBehavior}
                          onChange={(e) => setForm({ ...form, observedBehavior: e.target.value })}
                          className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-serif-doc font-bold text-[#1b2a4a] mb-1">
                            드러난 역량
                          </label>
                          <input
                            type="text"
                            value={form.competency}
                            onChange={(e) => setForm({ ...form, competency: e.target.value })}
                            className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-serif-doc font-bold text-[#1b2a4a] mb-1">
                            성장 / 변화 모습
                          </label>
                          <input
                            type="text"
                            value={form.growthAspect}
                            onChange={(e) => setForm({ ...form, growthAspect: e.target.value })}
                            className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleVerify}
                          className="w-full py-2.5 px-4 rounded bg-[#1b2a4a] hover:bg-[#283d6a] text-white font-serif-doc font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>관찰 내용 정리 및 규정 검증하기 (정리하기)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assembled Sentence & Verification Results Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {verification && assembledText ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Stamp Seal Card */}
              <Stamp verification={verification} />

              {/* Assembled Sentence Result Box */}
              <div className="doc-card rounded-lg overflow-hidden border border-[#dcd7cb] bg-white">
                <div className="bg-[#1b2a4a] text-[#f7f5ef] px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#b8433d]" />
                    <span className="font-serif-doc font-bold text-xs">
                      조립된 세특 문장 (관찰사실 기반)
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setIsEditingAssembled(!isEditingAssembled)}
                      className="px-2 py-0.5 text-[11px] rounded bg-[#2e4066] text-white border border-[#3e5380] hover:bg-[#3d5588] transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingAssembled ? '완료' : '수정'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(assembledText)}
                      className="px-2 py-0.5 text-[11px] rounded bg-[#b8433d] text-white hover:bg-[#a33832] transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedNotification ? '복사됨!' : '문장 복사'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-ruled-paper">
                  {isEditingAssembled ? (
                    <div>
                      <textarea
                        rows={6}
                        value={assembledText}
                        onChange={(e) => handleAssembledChange(e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#1b2a4a] rounded bg-white leading-relaxed font-sans focus:outline-none"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        * 직접 수정 시 글자수와 금지어가 즉시 재계산됩니다.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#1b2a4a] leading-relaxed font-sans whitespace-pre-wrap select-text">
                      {assembledText}
                    </p>
                  )}

                  {/* AI Polish Button & Instruction Disclaimer */}
                  <div className="mt-3 pt-3 border-t border-[#d8e5d2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <button
                      onClick={handleFetchPolishSuggestions}
                      disabled={isPolishing}
                      className="px-3 py-1.5 rounded bg-[#1b2a4a] hover:bg-[#283e6b] text-white font-serif-doc font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      {isPolishing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                          <span>Gemini AI 표현 다듬는 중...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>AI 윤문 제안 보기</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-slate-600 font-serif-doc">
                      ✨ AI는 표현만 다듬으며, 사실 내용을 추가하지 않습니다.
                    </span>
                  </div>

                  {polishError && (
                    <div className="mt-2 text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                      {polishError}
                    </div>
                  )}

                  {/* Render Polish Suggestions */}
                  {polishSuggestions && polishSuggestions.length > 0 && (
                    <div className="mt-4 p-3 rounded-md bg-amber-50/90 border border-amber-300 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1b2a4a] border-b border-amber-200 pb-1.5">
                        <span className="flex items-center space-x-1">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>AI 윤문 제안 (표현 다듬기 2안)</span>
                        </span>
                        <button
                          onClick={() => setPolishSuggestions(null)}
                          className="text-[11px] text-slate-500 hover:text-slate-700 underline cursor-pointer"
                        >
                          닫기
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {polishSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2.5 rounded bg-white border border-amber-200 text-xs text-slate-800 space-y-2 hover:border-[#1b2a4a] transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-serif-doc font-bold text-[10px]">
                                제안 대안 {index + 1}
                              </span>
                              <button
                                onClick={() => handleApplySuggestion(suggestion)}
                                className="px-2 py-1 rounded bg-[#b8433d] hover:bg-[#a23832] text-white font-bold text-[11px] font-serif-doc transition-colors cursor-pointer flex items-center space-x-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>이 표현 사용하기</span>
                              </button>
                            </div>
                            <p className="leading-relaxed font-sans">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed Checklist Breakdown Card */}
                <div className="p-4 border-t border-[#e5e0d3] bg-slate-50/80 space-y-3">
                  {/* Gauge 1: Byte Bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700">1. 글자 수 검증</span>
                      <span className="font-mono-code text-xs font-bold text-[#1b2a4a]">
                        {verification.byteCount} / 1,500 Bytes ({Math.round((verification.byteCount / 1500) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          verification.isByteOver
                            ? 'bg-rose-600'
                            : verification.byteCount > 1300
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, (verification.byteCount / 1500) * 100)}%` }}
                      ></div>
                    </div>
                    {verification.isByteOver && (
                      <p className="text-[11px] text-rose-700 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>1,500바이트 기준을 초과하였습니다. 문장을 축약해 주세요.</span>
                      </p>
                    )}
                  </div>

                  {/* Gauge 2: Prohibited Terms */}
                  <div className="pt-1">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700">2. 금지 표현 검증</span>
                      <span className={`font-bold text-xs ${verification.prohibited.hasProhibited ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {verification.prohibited.hasProhibited ? '⚠️ 금지어 감지' : '✓ 정상 (금지어 없음)'}
                      </span>
                    </div>

                    {verification.prohibited.hasProhibited ? (
                      <div className="p-2 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                        <p className="font-semibold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>기재 제한 표현이 감지되었습니다:</span>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {verification.prohibited.foundTerms.map((term, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 font-mono-code font-bold text-[11px]">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">수상실적, 자격증, 사교육 관련 금지어가 포함되어 있지 않습니다.</p>
                    )}
                  </div>

                  {/* Gauge 3: Duplicate Similarity */}
                  <div className="pt-1">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700">3. 학급 중복 기재 검사</span>
                      <span className={`font-bold text-xs ${verification.duplicate.isWarning ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {verification.duplicate.isWarning ? '⚠️ 중복 위험' : '✓ 통과'}
                      </span>
                    </div>

                    {verification.duplicate.isWarning ? (
                      <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                        <p className="font-semibold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>학급 명단과 유사도 40% 이상 감지!</span>
                        </p>
                        <p className="text-[11px]">
                          <strong>[{verification.duplicate.targetStudentName}]</strong> 학생의 세특 기록과{' '}
                          <strong className="font-mono-code text-rose-900">{verification.duplicate.similarityPercentage}%</strong> 유사합니다.
                        </p>

                        {/* Paraphrase AI Button */}
                        <div className="pt-1">
                          <button
                            onClick={handleFetchParaphraseSuggestions}
                            disabled={isParaphrasing}
                            className="px-2.5 py-1.5 rounded bg-rose-700 hover:bg-rose-800 text-white font-serif-doc font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isParaphrasing ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Gemini AI 표현 다양화 중...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>다른 표현으로 바꾸기 (AI 중복 회피)</span>
                              </>
                            )}
                          </button>
                        </div>

                        {paraphraseError && (
                          <p className="text-[11px] text-rose-800 mt-1">{paraphraseError}</p>
                        )}

                        {/* Render Paraphrase Suggestions */}
                        {paraphraseSuggestions && paraphraseSuggestions.length > 0 && (
                          <div className="mt-2 p-2.5 rounded bg-white border border-rose-300 space-y-2">
                            <div className="text-[11px] font-bold text-rose-900 border-b border-rose-200 pb-1 flex items-center justify-between">
                              <span>Gemini AI 중복 회피 표현 대안</span>
                              <button
                                onClick={() => setParaphraseSuggestions(null)}
                                className="text-[10px] text-slate-500 hover:underline cursor-pointer"
                              >
                                닫기
                              </button>
                            </div>
                            {paraphraseSuggestions.map((suggestion, idx) => (
                              <div key={idx} className="p-2 rounded bg-rose-50/50 border border-rose-200 text-xs space-y-1.5">
                                <p className="text-slate-800 font-sans leading-relaxed">{suggestion}</p>
                                <button
                                  onClick={() => handleApplySuggestion(suggestion)}
                                  className="px-2 py-0.5 rounded bg-rose-700 hover:bg-rose-800 text-white font-bold text-[10px] font-serif-doc cursor-pointer flex items-center space-x-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>이 표현 사용하기</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">
                        학급 최고 유사도: <strong className="font-mono-code">{verification.duplicate.similarityPercentage}%</strong> (기준치 40% 미만으로 개별성 확보)
                      </p>
                    )}
                  </div>
                </div>

                {/* Add to Roster Action Bar */}
                <div className="p-3 bg-slate-100 border-t border-[#dcd7cb] flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    검증을 마친 후 학급 명단에 저장하세요.
                  </span>

                  <button
                    onClick={handleSaveToRoster}
                    className="px-4 py-2 rounded bg-[#5f7a52] hover:bg-[#4d6442] text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{addedNotification ? '명단에 저장됨!' : '학급 명단에 추가'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Blank state guiding teacher */
            <div className="doc-card rounded-lg p-8 text-center bg-white/70 border border-dashed border-[#c8c2b4] flex flex-col items-center justify-center space-y-3 min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-[#f0ebd9] border border-[#dcd7cb] flex items-center justify-center text-[#1b2a4a]">
                <FileText className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-serif-doc font-bold text-base text-[#1b2a4a]">
                양식을 작성 후 '정리하기'를 클릭해 주세요
              </h3>
              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                선생님께서 입력하신 사실을 하나의 완결된 세특 문장으로 조립하고, 글자수, 금지어, 학급 중복도를 사전 점검합니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lower Section: Saved Class Roster (학급 세특 기록 명단) */}
      <div className="doc-card rounded-lg overflow-hidden border border-[#dcd7cb] bg-white">
        <div className="bg-[#1b2a4a] text-[#f7f5ef] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#b8433d]">
          <div className="flex items-center space-x-2.5">
            <Users className="w-5 h-5 text-[#b8433d]" />
            <div>
              <h2 className="font-serif-doc font-bold text-base">학급 세특 기록 및 비교 검증 명단</h2>
              <p className="text-xs text-slate-300">
                추가된 학생들의 문장이 저장되어 다음 학생 입력 시 실시간 유사도 비교 대상이 됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportRosterTXT}
              disabled={roster.length === 0}
              className="px-3 py-1.5 rounded bg-[#2e4066] hover:bg-[#3e5380] disabled:opacity-40 text-xs font-semibold text-white border border-[#3e5380] transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>전체 TXT 다운로드</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-[#e5e0d3] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={rosterSearch}
              onChange={(e) => setRosterSearch(e.target.value)}
              placeholder="학생 이름, 과목, 세특 검색..."
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-[#c8c2b4] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#1b2a4a]"
            />
          </div>

          <div className="text-xs font-mono-code text-slate-600">
            등록 수: <strong>{filteredRoster.length}</strong> / {roster.length}명
          </div>
        </div>

        {/* Roster Cards List */}
        <div className="p-4 bg-ruled-light space-y-3 max-h-[500px] overflow-y-auto">
          {filteredRoster.length > 0 ? (
            filteredRoster.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded border border-[#dcd7cb] shadow-2xs hover:border-[#1b2a4a] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0ebd9] pb-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif-doc font-bold text-sm text-[#1b2a4a]">
                      {item.studentName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#f0ebd9] text-[#1b2a4a] text-xs font-semibold">
                      {item.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono-code">
                      성취: {item.achievementLevel}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span
                      className={`font-mono-code font-bold px-2 py-0.5 rounded ${
                        item.verification.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.verification.status === 'PASS' ? '✓ 통과' : '⚠️ 검토필요'} ({item.verification.byteCount} B)
                    </span>

                    <button
                      onClick={() => handleCopyText(item.assembledText)}
                      className="p-1 text-slate-500 hover:text-[#1b2a4a] transition-colors cursor-pointer"
                      title="문장 복사"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onRemoveFromRoster(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-sans">
                  {item.assembledText}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              등록된 학생 세특 기록이 없습니다. 상단에서 작성 후 '학급 명단에 추가'를 눌러주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
