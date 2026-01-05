
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ProjectFormData, InvestmentProject, GroundingSource } from "../types";

export const generateInvestmentProject = async (data: ProjectFormData): Promise<InvestmentProject> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 1. Geração do Plano com Grounding (Busca no Google)
  const textModel = "gemini-3-pro-preview";
  const prompt = `Gere um projeto de investimento completo para o MERCADO ANGOLANO (2024/2025).
  Moeda: Kwanza (AOA).
  Negócio: ${data.projectName} em ${data.industry}.
  Público: ${data.targetMarket}. Investimento: ${data.investmentAmount}.
  Metas: ${data.mainGoals}. Diferenciais: ${data.keyFeatures}.
  
  IMPORTANTE: Use dados REAIS da economia de Angola (taxas do BNA, inflação atual).`;

  const textResponse = await ai.models.generateContent({
    model: textModel,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          industry: { type: Type.STRING },
          executiveSummary: { type: Type.STRING },
          marketAnalysis: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              competitors: { type: Type.STRING },
            },
            required: ["overview", "targetAudience", "competitors"]
          },
          marketingPlan: {
            type: Type.OBJECT,
            properties: {
              strategy: { type: Type.STRING },
              channels: { type: Type.ARRAY, items: { type: Type.STRING } },
              positioning: { type: Type.STRING },
            },
            required: ["strategy", "channels", "positioning"]
          },
          operationsPlan: { type: Type.STRING },
          financialProjection: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              yearlyData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    year: { type: Type.INTEGER },
                    revenue: { type: Type.NUMBER },
                    expenses: { type: Type.NUMBER },
                    profit: { type: Type.NUMBER }
                  },
                  required: ["year", "revenue", "expenses", "profit"]
                }
              },
              breakEvenPoint: { type: Type.STRING },
              roiEstimate: { type: Type.STRING }
            },
            required: ["summary", "yearlyData", "breakEvenPoint", "roiEstimate"]
          },
          swotAnalysis: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["strengths", "weaknesses", "opportunities", "threats"]
          },
          conclusion: { type: Type.STRING }
        },
        required: ["title", "industry", "executiveSummary", "marketAnalysis", "marketingPlan", "operationsPlan", "financialProjection", "swotAnalysis", "conclusion"]
      }
    }
  });

  const project = JSON.parse(textResponse.text) as InvestmentProject;
  project.id = Date.now().toString();

  // Extrair fontes da pesquisa
  const chunks = textResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    project.groundingSources = chunks
      .map((c: any) => ({ title: c.web?.title, uri: c.web?.uri }))
      .filter((s: any) => s.uri);
  }

  // 2. Geração da Imagem de Conceito
  try {
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: `Um logotipo corporativo moderno e profissional para uma empresa angolana chamada "${project.title}" no setor de ${project.industry}. Estilo minimalista, cores elegantes, fundo limpo.`,
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    const imagePart = imageResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart) {
      project.conceptImageUrl = `data:image/png;base64,${imagePart.inlineData.data}`;
    }
  } catch (e) { console.error("Erro na imagem", e); }

  // 3. Geração do Áudio (TTS) do Pitch
  try {
    const audioResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: `Diga com entusiasmo e tom profissional de investidor: ${project.executiveSummary.substring(0, 500)}`,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    });
    const audioData = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      project.audioPitchBase64 = audioData;
    }
  } catch (e) { console.error("Erro no áudio", e); }

  return project;
};
