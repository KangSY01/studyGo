/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  Copy, 
  Edit2, 
  FileCheck, 
  FileText, 
  Printer, 
  RefreshCw,
  RotateCcw, 
  Sparkles, 
  Table 
} from 'lucide-react';
import { AssessmentMethod, AssessmentPlan } from '../types';
import { PRESET_ACHIEVEMENT_STANDARDS } from '../data/mockData';
import { generateRubricAndItemPlan } from '../utils/rubricGenerator';

export const TabRubricGenerator: React.FC = () => {
  const [subject, setSubject] = useState<string>('통합사회');
  const [achievementStandard, setAchievementStandard] = useState<string>(
    '[10통사01-02] 사회 현상을 다양한 자료를 활용하여 탐구하고 근거를 들어 설명할 수 있다.'
  );
  const [method, setMethod] = useState<AssessmentMethod>('보고서');
  const [maxScore, setMaxScore] = useState<number>(20);

  const [assessmentPlan, setAssessmentPlan] = useState<AssessmentPlan | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Gemini API Loading & Error states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Generate Rubric and Assessment Plan using Gemini API
  const handleGenerate = async () => {
    if (!achievementStandard.trim()) return;

    setIsGenerating(true);
    setGenerateError(null);

    const safeScore = Math.max(10, Math.min(100, maxScore || 20));
    const highMin = Math.round(safeScore * 0.85);
    const highMax = safeScore;
    const medMin = Math.round(safeScore * 0.60);
    const medMax = Math.max(medMin, highMin - 1);
    const lowMin = 0;
    const lowMax = Math.max(0, medMin - 1);

    try {
      const res = await fetch('/api/gemini/rubric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          achievementStandard,
          method,
          maxScore: safeScore
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rubric 생성 실패');

      const plan: AssessmentPlan = {
        id: `plan-${Date.now()}`,
        subject,
        achievementStandard,
        method,
        maxScore: safeScore,
        itemTitle: data.itemTitle || `[수행평가 문항] ${subject} 성취기준 연계 ${method}`,
        itemDescription: data.itemDescription || '상세 지시사항이 생성되었습니다.',
        rubric: [
          {
            level: '상',
            scoreRangeText: `${highMin}점 ~ ${highMax}점`,
            minScore: highMin,
            maxScore: highMax,
            percentRangeText: '85% ~ 100%',
            criteria: data.rubricCriteria?.high || '성취기준의 핵심 개념을 완벽히 이해하고 논리적 근거를 명확히 제시함.'
          },
          {
            level: '중',
            scoreRangeText: `${medMin}점 ~ ${medMax}점`,
            minScore: medMin,
            maxScore: medMax,
            percentRangeText: '60% ~ 84%',
            criteria: data.rubricCriteria?.med || '성취기준의 주요 내용을 이해하였으나 일부 근거의 타당성이 부족함.'
          },
          {
            level: '하',
            scoreRangeText: `${lowMin}점 ~ ${lowMax}점`,
            minScore: lowMin,
            maxScore: lowMax,
            percentRangeText: '0% ~ 59%',
            criteria: data.rubricCriteria?.low || '성취기준에 대한 이해가 낮거나 근거 제시가 미흡함.'
          }
        ],
        createdAt: new Date().toISOString()
      };

      setAssessmentPlan(plan);
      setIsEditing(false);
    } catch (err: any) {
      console.warn('Gemini API fallback to template generator:', err);
      // Fallback gracefully to template generator
      const fallbackPlan = generateRubricAndItemPlan(subject, achievementStandard, method, maxScore);
      setAssessmentPlan(fallbackPlan);
      setIsEditing(false);
      setGenerateError('Gemini API 호출 중 오류가 발생하여 기본 템플릿으로 생성되었습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load Preset Achievement Standard
  const handleSelectPreset = (presetIndex: number) => {
    const p = PRESET_ACHIEVEMENT_STANDARDS[presetIndex];
    if (p) {
      setSubject(p.subject);
      setAchievementStandard(p.standard);
      if (p.methods && p.methods.length > 0) {
        setMethod(p.methods[0] as AssessmentMethod);
      }
    }
  };

  // Copy Full Assessment Plan Text
  const handleCopyPlan = () => {
    if (!assessmentPlan) return;

    let text = `====================================\n`;
    text += `${assessmentPlan.itemTitle}\n`;
    text += `과목: ${assessmentPlan.subject} | 평가 방식: ${assessmentPlan.method} | 총 배점: ${assessmentPlan.maxScore}점\n`;
    text += `성취기준: ${assessmentPlan.achievementStandard}\n`;
    text += `====================================\n\n`;
    text += `[문항 안내 및 지시사항]\n${assessmentPlan.itemDescription}\n\n`;
    text += `[3단계 채점기준 (Rubric)]\n`;

    assessmentPlan.rubric.forEach((r) => {
      text += `▶ 수준 [${r.level}] (${r.scoreRangeText} / ${r.percentRangeText})\n`;
      text += `   - 기준: ${r.criteria}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Input Form Section */}
      <div className="doc-card rounded-lg overflow-hidden border border-[#dcd7cb] bg-white">
        <div className="bg-[#1b2a4a] text-[#f7f5ef] px-5 py-3.5 flex items-center justify-between border-b-2 border-[#b8433d]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#b8433d]" />
            <h2 className="font-serif-doc font-bold text-base">수행평가 문항 및 채점기준(Rubric) 입력 조건</h2>
          </div>

          <div className="flex items-center space-x-2">
            <select
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) handleSelectPreset(val);
              }}
              defaultValue=""
              className="text-xs bg-[#2e4066] text-[#f7f5ef] border border-[#3e5380] rounded px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>
                ⚡ 성취기준 예시 선택
              </option>
              {PRESET_ACHIEVEMENT_STANDARDS.map((p, idx) => (
                <option key={idx} value={idx}>
                  [{p.subject}] {p.standard.slice(0, 32)}...
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSubject('통합사회');
                setAchievementStandard('');
                setMethod('보고서');
                setMaxScore(20);
                setAssessmentPlan(null);
              }}
              className="p-1 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
              title="초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="p-5 bg-ruled-light space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                과목 <span className="text-rose-600">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none cursor-pointer"
              >
                <option value="공통국어1">공통국어1</option>
                <option value="공통수학1">공통수학1</option>
                <option value="공통영어1">공통영어1</option>
                <option value="통합사회">통합사회</option>
                <option value="통합과학">통합과학</option>
              </select>
            </div>

            {/* Assessment Method */}
            <div>
              <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                평가 방법 <span className="text-rose-600">*</span>
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as AssessmentMethod)}
                className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none cursor-pointer"
              >
                <option value="보고서">보고서</option>
                <option value="발표">발표</option>
                <option value="논술형">논술형</option>
                <option value="실험실습">실험실습</option>
                <option value="토론">토론</option>
              </select>
            </div>

            {/* Total Max Score */}
            <div>
              <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
                총 배점 (점수) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value) || 20)}
                className="w-full text-xs p-2 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none font-mono-code"
              />
            </div>
          </div>

          {/* Achievement Standard Text */}
          <div>
            <label className="block text-xs font-serif-doc font-bold text-[#1b2a4a] mb-1">
              교육과정 성취기준 텍스트 입력 <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={2}
              value={achievementStandard}
              onChange={(e) => setAchievementStandard(e.target.value)}
              placeholder="예: [10통사01-02] 사회 현상을 다양한 자료를 활용하여 탐구하고 근거를 들어 설명할 수 있다."
              className="w-full text-xs p-2.5 border border-[#c8c2b4] rounded bg-white focus:ring-1 focus:ring-[#1b2a4a] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded bg-[#1b2a4a] hover:bg-[#283d6a] text-white font-serif-doc font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Gemini AI가 성취기준 맞춤 문항 및 Rubric 생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI 성취기준 맞춤 수행평가 문항 및 3단계 Rubric 생성하기</span>
                </>
              )}
            </button>

            {generateError && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                ⚠️ {generateError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Generated Output Plan Section */}
      {assessmentPlan ? (
        <div className="doc-card rounded-lg overflow-hidden border border-[#dcd7cb] bg-white print-area animate-fadeIn">
          {/* Header Action Bar */}
          <div className="bg-[#1b2a4a] text-[#f7f5ef] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#b8433d] no-print">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-[#b8433d]" />
              <h2 className="font-serif-doc font-bold text-base">
                생성된 수행평가 계획안 및 채점기준표
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded bg-[#2e4066] hover:bg-[#3e5380] text-xs font-semibold text-white border border-[#3e5380] transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? '수정 완료' : '기준 수정'}</span>
              </button>

              <button
                onClick={handleCopyPlan}
                className="px-3 py-1.5 rounded bg-[#b8433d] hover:bg-[#a33832] text-xs font-semibold text-white transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedNotification ? '복사됨!' : '전체 복사'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded bg-[#5f7a52] hover:bg-[#4d6442] text-xs font-semibold text-white transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>인쇄 / PDF</span>
              </button>
            </div>
          </div>

          {/* Official Document Body */}
          <div className="p-6 space-y-6 bg-ruled-paper">
            {/* Title & Metadata Header Box */}
            <div className="border-2 border-[#1b2a4a] p-5 rounded bg-white shadow-xs">
              <div className="text-center border-b border-[#e5e0d3] pb-3 mb-4">
                <span className="text-xs font-mono-code text-slate-500 font-bold uppercase tracking-widest">
                  ASSESSMENT SPECIFICATION SHEET
                </span>
                <h3 className="text-xl font-bold font-serif-doc text-[#1b2a4a] mt-1">
                  {assessmentPlan.itemTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2 bg-[#f7f5ef] rounded border border-[#e5e0d3]">
                  <span className="text-slate-500 block text-[11px]">과목</span>
                  <strong className="text-[#1b2a4a] font-serif-doc">{assessmentPlan.subject}</strong>
                </div>
                <div className="p-2 bg-[#f7f5ef] rounded border border-[#e5e0d3]">
                  <span className="text-slate-500 block text-[11px]">평가 방법</span>
                  <strong className="text-[#1b2a4a] font-serif-doc">{assessmentPlan.method}</strong>
                </div>
                <div className="p-2 bg-[#f7f5ef] rounded border border-[#e5e0d3]">
                  <span className="text-slate-500 block text-[11px]">만점 배점</span>
                  <strong className="text-[#1b2a4a] font-mono-code">{assessmentPlan.maxScore} 점</strong>
                </div>
                <div className="p-2 bg-[#f7f5ef] rounded border border-[#e5e0d3]">
                  <span className="text-slate-500 block text-[11px]">단계 수</span>
                  <strong className="text-[#1b2a4a] font-serif-doc">3 단계 (상/중/하)</strong>
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-slate-50 rounded border border-[#e5e0d3] text-xs">
                <span className="font-bold text-[#1b2a4a]">관련 성취기준: </span>
                <span className="text-slate-700 leading-relaxed">{assessmentPlan.achievementStandard}</span>
              </div>
            </div>

            {/* Item Description Box */}
            <div className="border border-[#dcd7cb] rounded bg-white p-5 space-y-2">
              <h4 className="font-serif-doc font-bold text-sm text-[#1b2a4a] flex items-center space-x-2 border-b border-[#f0ebd9] pb-2">
                <FileText className="w-4 h-4 text-[#b8433d]" />
                <span>평가 문항 지시사항 및 수행 안내</span>
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {assessmentPlan.itemDescription}
              </p>
            </div>

            {/* 3-Tier Rubric Table */}
            <div className="border border-[#dcd7cb] rounded bg-white overflow-hidden space-y-2">
              <div className="bg-[#1b2a4a] text-[#f7f5ef] px-4 py-2.5 flex items-center space-x-2">
                <Table className="w-4 h-4 text-[#b8433d]" />
                <h4 className="font-serif-doc font-bold text-sm">
                  3단계 채점기준표 (Rubric) 및 비율별 점수 산정
                </h4>
              </div>

              <div className="overflow-x-auto p-4">
                <table className="w-full text-xs text-left border-collapse border border-[#dcd7cb]">
                  <thead>
                    <tr className="bg-[#f0ebd9] text-[#1b2a4a] border-b border-[#dcd7cb] font-serif-doc font-bold">
                      <th className="p-3 border-r border-[#dcd7cb] w-20 text-center">수준</th>
                      <th className="p-3 border-r border-[#dcd7cb] w-28 text-center">비율 및 점수범위</th>
                      <th className="p-3">세부 평가지표 및 평가기준 요산</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessmentPlan.rubric.map((lvl, index) => {
                      const levelColorMap = {
                        상: 'bg-emerald-50 text-emerald-900 border-emerald-200',
                        중: 'bg-amber-50 text-amber-900 border-amber-200',
                        하: 'bg-rose-50 text-rose-900 border-rose-200'
                      };

                      return (
                        <tr key={index} className="border-b border-[#dcd7cb] hover:bg-slate-50/80">
                          {/* Level Tag */}
                          <td className="p-3 border-r border-[#dcd7cb] text-center font-bold">
                            <span
                              className={`inline-block px-3 py-1 rounded text-xs font-serif-doc font-bold border ${
                                levelColorMap[lvl.level]
                              }`}
                            >
                              {lvl.level}
                            </span>
                          </td>

                          {/* Score Range */}
                          <td className="p-3 border-r border-[#dcd7cb] text-center font-mono-code font-bold text-[#1b2a4a]">
                            <div>{lvl.scoreRangeText}</div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              ({lvl.percentRangeText})
                            </div>
                          </td>

                          {/* Criteria */}
                          <td className="p-3 leading-relaxed text-slate-800">
                            {isEditing ? (
                              <textarea
                                rows={3}
                                value={lvl.criteria}
                                onChange={(e) => {
                                  const updatedRubric = [...assessmentPlan.rubric];
                                  updatedRubric[index].criteria = e.target.value;
                                  setAssessmentPlan({ ...assessmentPlan, rubric: updatedRubric });
                                }}
                                className="w-full p-2 border border-[#1b2a4a] rounded text-xs bg-white focus:outline-none"
                              />
                            ) : (
                              <span>{lvl.criteria}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Guidance State */
        <div className="doc-card rounded-lg p-10 text-center bg-white/70 border border-dashed border-[#c8c2b4] flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#f0ebd9] border border-[#dcd7cb] flex items-center justify-center text-[#1b2a4a]">
            <Award className="w-8 h-8 opacity-70" />
          </div>
          <h3 className="font-serif-doc font-bold text-base text-[#1b2a4a]">
            과목 및 성취기준을 선택하고 'Rubric 생성'을 눌러주세요
          </h3>
          <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
            성취기준 맥락과 만점 배점을 기반으로 상(85~100%), 중(60~84%), 하(0~59%) 비율별 자동 점수 구간 및 구체적 평가 지표를 즉시 구성합니다.
          </p>
        </div>
      )}
    </div>
  );
};
