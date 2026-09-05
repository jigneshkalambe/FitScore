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
