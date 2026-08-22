import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeResumeMatch(resumeText, jdText) {
    const prompt = `
You are a resume analysis assistant. Compare the resume below against the job description and return ONLY a valid JSON object — no markdown, no extra text, no explanation outside the JSON.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jdText}
"""

Return JSON in exactly this structure:
{
  "score": <number 0-100>,
  "matchedSkills": [<array of strings>],
  "missingSkills": [<array of strings>],
  "summary": "<2-3 sentence plain-English verdict>"
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const rawText = response.text;

    // Gemini sometimes wraps JSON in ```json ... ``` even when told not to — strip it
    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    try {
        const parsed = JSON.parse(cleanedText);
        return parsed;
    } catch (err) {
        throw new Error("Failed to parse Gemini response as JSON: " + rawText);
    }
}

export { analyzeResumeMatch };
