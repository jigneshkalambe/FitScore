import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analysisSchema = {
    type: "object",
    properties: {
        score: {
            type: "integer",
            description: "Match score from 0 to 100.",
            minimum: 0,
            maximum: 100,
        },
        matchedSkills: {
            type: "array",
            description: "Skills present in both the resume and job description.",
            items: { type: "string" },
        },
        missingSkills: {
            type: "array",
            description:
                "Skills, tools, or qualifications explicitly required or preferred in the job description that are NOT mentioned anywhere in the resume. Go through the job description requirement by requirement and check each one against the resume. If a requirement is not clearly present in the resume, include it here. Only return an empty array if the resume genuinely covers every requirement.",
            items: { type: "string" },
        },
        summary: {
            type: "string",
            description: "A 2-3 sentence plain-English verdict.",
        },
    },
    required: ["score", "matchedSkills", "missingSkills", "summary"],
};

async function analyzeResumeMatch(resumeText, jdText, thinkingLevel = "medium") {
    const prompt = `
You are a resume analysis assistant. Compare the resume below against the job description.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jdText}
"""
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingLevel: thinkingLevel,
            },
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        },
    });

    console.log("finishReason:", response.candidates?.[0]?.finishReason);

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
