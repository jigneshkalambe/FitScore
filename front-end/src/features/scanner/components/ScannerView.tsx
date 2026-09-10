"use client";
import { ChangeEvent, DragEvent, useState } from "react";
import AnalyzeSection from "./AnalyzeSection";
import ResultSection from "./ResultSection";
import AnalyzingSection from "./AnalyzingSection";
import { uploadResume } from "@/features/scanner/api/resume";
import { toast } from "sonner";
import { analyzeResume } from "@/lib/api/analysis";
import UploadSection from "./UploadSection";
import Header from "@/components/layout/Header";

const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_SIZE = 5 * 1024 * 1024;

interface AnalysisResult {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
}

export default function ScannerView() {
    const [status, setStatus] = useState<"idle" | "reviewing" | "analyzing" | "done">("idle");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [extractedText, setExtractedText] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [jdText, setJdText] = useState<string>(
        "We are looking for a Backend Developer to join our engineering team and help build reliable, high-performance server-side applications.\n\nResponsibilities:\n- Develop and maintain backend services using Python and Django\n- Design and implement RESTful APIs and backend integrations\n- Work with databases and optimize queries for performance\n- Implement authentication, authorization, and security best practices\n- Write unit and integration tests for backend services\n- Debug production issues and improve application reliability\n- Collaborate with frontend developers and product teams\n- Participate in code reviews and technical design discussions\n\nRequirements:\n- 1-3 years of experience in backend development\n- Strong proficiency in Python\n- Experience with Django or Django REST Framework\n- Good understanding of REST API architecture\n- Experience with PostgreSQL or similar relational databases\n- Familiarity with Redis and background job processing\n- Understanding of authentication mechanisms such as JWT or OAuth\n- Experience with Git and collaborative development workflows\n- Knowledge of data structures, algorithms, and software design principles\n- Strong problem-solving and communication skills\n\nNice to have:\n- Experience with Celery\n- Familiarity with Docker and Kubernetes\n- Experience with AWS services\n- Knowledge of CI/CD pipelines\n- Exposure to microservices architecture",
    );
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) return "Please upload a PDF or DOCX file.";
        if (file.size > MAX_SIZE) return "File size must be less than 5MB.";
        return null;
    };

    const processFile = async (selectedFile: File) => {
        const validationError = validateFile(selectedFile);
        if (validationError) {
            toast.error(validationError);
            return;
        }
        setFile(selectedFile);
        setIsUploading(true);
        try {
            const response = await uploadResume(selectedFile);
            setExtractedText(response.data.extractedText);
            setStatus("reviewing");
        } catch (err) {
            toast.error("Could not read this file. Try a different one.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        if (!selectedFile) return;
        await processFile(selectedFile);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const droppedFile = event.dataTransfer.files?.[0] || null;
        if (!droppedFile) return;
        await processFile(droppedFile);
    };

    const goBackToUpload = () => {
        setStatus("idle");
        setFile(null);
        setExtractedText("");
    };

    const AnalyzeContent = async () => {
        setStatus("analyzing");

        try {
            const response = await analyzeResume(extractedText, jdText);
            setAnalysisResult(response.data);
            setStatus("done");
        } catch (err: any) {
            const backendMessage = err?.response?.data?.message;
            toast.error(backendMessage || "Something went wrong. Please try again");
            console.error("Error analyzing resume:", err);
            setStatus("reviewing");
            setAnalysisResult(null);
        }
    };

    const startOver = () => {
        setStatus("idle");
        setFile(null);
        setExtractedText("");
    };

    const replaceFile = async () => {
        const fileInput = document.getElementById("fileInput") as HTMLInputElement | null;
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <>
            <Header isIdle={status === "idle"} />
            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
                {status === "idle" ? (
                    <UploadSection
                        handleFileChange={handleFileChange}
                        handleDragOver={handleDragOver}
                        handleDragLeave={handleDragLeave}
                        handleDrop={handleDrop}
                        isDragging={isDragging}
                        isUploading={isUploading}
                    />
                ) : status === "reviewing" ? (
                    <AnalyzeSection
                        fileName={file?.name}
                        goBackToUpload={goBackToUpload}
                        AnalyzeContent={AnalyzeContent}
                        extractedText={extractedText}
                        setExtractedText={setExtractedText}
                        jdText={jdText}
                        setJdText={setJdText}
                    />
                ) : status === "analyzing" ? (
                    <AnalyzingSection />
                ) : (
                    <ResultSection startOver={startOver} analysisResult={analysisResult ? analysisResult : null} jdText={jdText} fileName={file?.name} />
                )}
            </div>
            <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
        </>
    );
}
