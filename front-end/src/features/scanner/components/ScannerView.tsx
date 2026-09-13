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
    const [jdText, setJdText] = useState<string>("");
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
            <div className="w-full flex-1 py-6 sm:py-8 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 sm:gap-8 md:gap-10">
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
