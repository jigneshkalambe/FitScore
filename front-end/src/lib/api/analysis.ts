import Axios from "@/instance/Axios";

interface AnalysisResponse {
    success: boolean;
    message: string;
    data: {
        score: number;
        matchedSkills: string[];
        missingSkills: string[];
        summary: string;
    };
}

export async function analyzeResume(resumeText: string, jdText: string) {
    const res = await Axios.post("/analysis/analyze", { resumeText, jdText });
    return res.data as AnalysisResponse;
}

export interface SaveAnalysisPayload {
    label?: string;
    jdText: string;
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
}

export async function saveAnalysis(payload: SaveAnalysisPayload) {
    const res = await Axios.post("/analysis/save", payload);
    return res.data;
}

export async function getHistory() {
    const res = await Axios.get("/analysis/history");
    return res.data;
}

export async function deleteAnalysis(id: string) {
    const res = await Axios.delete(`/analysis/history/${id}`);
    return res.data;
}
