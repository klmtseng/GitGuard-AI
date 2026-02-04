import { GoogleGenAI, Type } from "@google/genai";
import { FetchedRepoData, RepoAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    riskScore: { type: Type.NUMBER, description: "Overall risk score from 0 (Safe) to 100 (High Risk)." },
    riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
    summary: { type: Type.STRING, description: "Executive summary of the findings." },
    security: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "0-100 score where 100 is secure." },
        issues: { type: Type.ARRAY, items: { type: Type.STRING } },
        details: { type: Type.STRING, description: "Analysis of vulnerabilities." }
      }
    },
    maintenance: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        lastUpdateStatus: { type: Type.STRING },
        communityHealth: { type: Type.STRING }
      }
    },
    quality: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        complexity: { type: Type.STRING },
        documentation: { type: Type.STRING }
      }
    },
    license: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        compliant: { type: Type.BOOLEAN },
        type: { type: Type.STRING }
      }
    }
  }
};

export const analyzeRepoWithGemini = async (data: FetchedRepoData): Promise<RepoAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following GitHub repository metadata and file contents for risk assessment.
    
    Repository: ${data.owner}/${data.name}
    
    README Content (Truncated):
    ${data.readme || "Not available"}
    
    package.json Content:
    ${data.packageJson || "Not available"}
    
    requirements.txt Content:
    ${data.requirements || "Not available"}
    
    Please provide a comprehensive risk assessment focusing on:
    1. Security (dependencies, known vulnerabilities pattern).
    2. Maintenance (is it likely abandoned based on docs/versioning?).
    3. Code Quality (inferred from documentation and structure).
    4. Licensing (is it permissible for commercial use?).
    
    If files are missing, infer risk based on the repository identity (e.g. if it's a well known library like 'react' or 'express', trust it more, but if unknown and no docs, mark high risk).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as RepoAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};