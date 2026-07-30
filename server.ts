import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다. AI 기능 실행을 위해 Settings > Secrets에서 키를 등록해 주세요.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: 세특 문장 윤문 제안 (Polish Suggestions)
app.post("/api/gemini/polish", async (req, res) => {
  try {
    const { text, subject } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "교정할 원문 텍스트가 필요합니다." });
    }

    const ai = getGenAI();
    const systemInstruction = `당신은 대한민국 고등학교 생활기록부(세특) 전문 윤문 교정 AI입니다. 
교사가 작성/조립한 세특 문장의 어휘 수준과 문장 구성을 정교하고 세련되게 다듬는 역할을 수행합니다.

[CRITICAL MANDATE - 사실 보존 엄수]
1. 원문의 사실 내용(학생이 수행한 활동, 관찰된 행동, 분석 수치, 드러난 역량 등)을 절대로 추가, 변경, 삭제 또는 왜곡하지 마십시오.
2. 어휘와 문장 호응, 격식 있는 학술적 서술 표현만을 다듬으십시오.
3. 세특 특유의 명사형/서술형 종결어미(~함., ~임., ~를 보임.)를 유지하십시오.
4. 서로 다른 표현 스타일의 윤문 대안 2가지를 작성하여 반환하십시오.`;

    const prompt = `과목: ${subject || "과목 미지정"}\n원문 문장:\n"${text}"\n\n위 문장의 사실 관계를 100% 유지하면서 표현과 어휘만 다듬은 대안 2개를 JSON 배열 형태로 생성해 주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "윤문 교정 대안 문장",
          },
        },
      },
    });

    const responseText = response.text || "[]";
    const suggestions: string[] = JSON.parse(responseText);

    res.json({ suggestions });
  } catch (error: any) {
    console.error("Polish API Error:", error);
    res.status(500).json({
      error: error?.message || "윤문 제안 생성 중 오류가 발생했습니다.",
    });
  }
});

// 2. API: 유사도 중복 방지 - 표현 다양화 제안 (Paraphrase Suggestions)
app.post("/api/gemini/paraphrase", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "원문 텍스트가 필요합니다." });
    }

    const ai = getGenAI();
    const systemInstruction = `당신은 대한민국 고등학교 생활기록부(세특) 중복 기재 방지를 위한 표현 다양화 AI입니다.
교사가 작성한 세특 문장의 원래 의미와 관찰 사실을 100% 유지하면서, 학급 내 유사도를 낮출 수 있도록 어순, 어휘(유의어), 문장 구조를 다채롭게 바꾼 대안 문장 2개를 생성하십시오.

[CRITICAL MANDATE - 사실 보존 엄수]
1. 원문의 사실 및 학생 관찰 내역을 절대로 변경하거나 새로운 내용을 추가하지 마십시오.
2. 유의어 활용 및 어순 재배치를 통해 2-gram Jaccard 유사도를 효과적으로 떨어뜨릴 수 있는 표현 대안을 만드십시오.
3. 세특 서술체(~함., ~임.)를 철저히 유지하십시오.`;

    const prompt = `원문 문장:\n"${text}"\n\n위 문장의 관찰 사실과 의미를 그대로 유지하되 문장 구조와 어휘를 바꾼 표현 다양화 대안 2개를 JSON 배열로 생성해 주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "표현 다양화 대안 문장",
          },
        },
      },
    });

    const responseText = response.text || "[]";
    const suggestions: string[] = JSON.parse(responseText);

    res.json({ suggestions });
  } catch (error: any) {
    console.error("Paraphrase API Error:", error);
    res.status(500).json({
      error: error?.message || "표현 다양화 제안 생성 중 오류가 발생했습니다.",
    });
  }
});

// 3. API: 수행평가 문항 및 3단계 Rubric 생성 (Rubric Generation)
app.post("/api/gemini/rubric", async (req, res) => {
  try {
    const { subject, achievementStandard, method, maxScore } = req.body;
    if (!achievementStandard || typeof achievementStandard !== "string") {
      return res.status(400).json({ error: "성취기준 텍스트가 필요합니다." });
    }

    const ai = getGenAI();
    const systemInstruction = `당신은 대한민국 고등학교 교육과정 평가 전문가입니다.
입력된 교육과정 성취기준 텍스트와 평가 방식(보고서, 발표, 논술형, 실험실습, 토론 등)을 정밀 분석하여, 실제 교실에서 즉시 활용 가능한 '수행평가 문항 안내'와 '3단계 채점기준표(Rubric)'를 생성하십시오.

[작성 지침]
1. itemTitle: 과목명과 성취기준의 핵심 쟁점을 담은 공식 수행평가 문항 제목
2. itemDescription: 학생들에게 제시할 구체적인 과제 지시사항, 수행 조건, 작성/발표 분량 및 포함 요소
3. rubricCriteria:
   - high (상): 성취기준의 핵심 원리를 완벽히 이해하고 논리적/수학적/학술적 근거를 바탕으로 정교하게 수행한 수준
   - med (중): 성취기준의 주요 내용을 이해하였으나 일부 근거의 타당성이 부족하거나 논리 전개가 미흡한 수준
   - low (하): 성취기준에 대한 이해가 낮거나 근거 제시가 없으며 지정된 수행 조건을 충족하지 못한 수준`;

    const prompt = `과목: ${subject || "통합사회"}\n평가 방식: ${method || "보고서"}\n총 배점: ${maxScore || 20}점\n성취기준:\n"${achievementStandard}"\n\n위 성취기준 텍스트를 반영한 문항과 3단계(상/중/하) Rubric 평가기준을 작성해 주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemTitle: { type: Type.STRING, description: "수행평가 문항 제목" },
            itemDescription: { type: Type.STRING, description: "수행평가 문항 안내 및 지시사항" },
            rubricCriteria: {
              type: Type.OBJECT,
              properties: {
                high: { type: Type.STRING, description: "상 수준 세부 평가기준" },
                med: { type: Type.STRING, description: "중 수준 세부 평가기준" },
                low: { type: Type.STRING, description: "하 수준 세부 평가기준" },
              },
              required: ["high", "med", "low"],
            },
          },
          required: ["itemTitle", "itemDescription", "rubricCriteria"],
        },
      },
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText);

    res.json(data);
  } catch (error: any) {
    console.error("Rubric API Error:", error);
    res.status(500).json({
      error: error?.message || "Rubric 생성 중 오류가 발생했습니다.",
    });
  }
});

// 4. API: 빠른 입력(AI 대화형) 분석 및 되묻기 (Quick Conversational Analysis)
app.post("/api/gemini/quick-analyze", async (req, res) => {
  try {
    const { rawText, subject, previousAnalysis, answerToQuestion } = req.body;
    if (!rawText && !answerToQuestion) {
      return res.status(400).json({ error: "분석할 텍스트 입력이 필요합니다." });
    }

    const ai = getGenAI();
    const systemInstruction = `당신은 대한민국 고등학교 세특(세부능력 및 특기사항) 작성 보조 AI입니다.
교사가 자유롭게 입력하거나 음성으로 말한 관찰 메모를 분석하여 다음 세특 4대 항목으로 정확히 분류하고 정리하십시오.

[분류 항목]
1. activityName: 활동/과제명
2. observedBehavior: 구체적으로 관찰한 행동
3. competency: 드러난 역량
4. growthAspect: 성장/변화 모습

[CRITICAL MANDATE]
1. 입력된 텍스트에 분명한 근거가 있는 내용만 추출하여 각 항목에 채우십시오.
2. 입력에 해당 내용이 전혀 없거나 근거가 부족하면 해당 항목은 절대로 지어내지 말고 빈 문자열("")로 남겨두십시오.
3. 항목 중 부족하거나 구체성이 부족한 부분이 있다면, 교사에게 사실 관계를 묻는 친절하고 구체적인 추가 질문(followUpQuestions)을 1~2개 생성하십시오.
4. 이미 충분한 정보가 갖추어졌다면 followUpQuestions는 빈 배열([])로 반환하십시오.`;

    let prompt = `과목: ${subject || "과목 미지정"}\n교사 자유 메모:\n"${rawText || ""}"\n`;

    if (previousAnalysis) {
      prompt += `\n[기존 추출 내역]\n- 활동명: ${previousAnalysis.activityName || "(미입력)"}\n- 관찰행동: ${previousAnalysis.observedBehavior || "(미입력)"}\n- 역량: ${previousAnalysis.competency || "(미입력)"}\n- 성장모습: ${previousAnalysis.growthAspect || "(미입력)"}\n`;
    }

    if (answerToQuestion) {
      prompt += `\n[교사의 추가 답변/보충 내용]:\n"${answerToQuestion}"\n\n위 보충 답변을 반영하여 기존 내역을 업데이트하고, 아직 부족한 점이 있다면 새로운 추가 질문을, 충분하다면 빈 질문 배열을 반환해 주세요.`;
    } else {
      prompt += `\n위 교사 메모를 분석하여 4개 항목을 분류하고, 부족한 항목에 대한 구체화 질문을 1~2개 포함한 JSON으로 반환해 주세요.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activityName: { type: Type.STRING, description: "활동/과제명" },
            observedBehavior: { type: Type.STRING, description: "구체적으로 관찰한 행동" },
            competency: { type: Type.STRING, description: "드러난 역량" },
            growthAspect: { type: Type.STRING, description: "성장/변화 모습" },
            followUpQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "부족한 항목을 보충하기 위한 교사 대상 구체화 질문 (최대 2개)",
            },
          },
          required: ["activityName", "observedBehavior", "competency", "growthAspect", "followUpQuestions"],
        },
      },
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText);

    res.json({
      activityName: data.activityName || "",
      observedBehavior: data.observedBehavior || "",
      competency: data.competency || "",
      growthAspect: data.growthAspect || "",
      followUpQuestions: Array.isArray(data.followUpQuestions) ? data.followUpQuestions : [],
    });
  } catch (error: any) {
    console.error("Quick Analyze API Error:", error);
    res.status(500).json({
      error: error?.message || "빠른 입력 분석 중 오류가 발생했습니다.",
    });
  }
});

// Vite / Static server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
