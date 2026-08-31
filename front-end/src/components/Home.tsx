"use client";
import { ChangeEvent, DragEvent, useState } from "react";
import Header from "./Header";
import UploadSection from "./UploadSection";
import AnalyzeSection from "./AnalyzeSection";
import ResultSection from "./ResultSection";
import AnalyzingSection from "./AnalyzingSection";

export default function Home() {
    const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "done">("idle");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
        setStatus("uploading");
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0] || null;
        console.log("Dropped file:", droppedFile);
        if (!droppedFile) return;

        const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

        if (!allowedTypes.includes(droppedFile.type)) {
            alert("Please upload a PDF or DOCX file.");
            return;
        }

        if (droppedFile.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB.");
            return;
        }

        setFile(droppedFile);
        setStatus("uploading");
        setIsDragging(false);
    };

    const goBackToUpload = () => {
        setStatus("idle");
        setFile(null);
    };

    const goToAnalyzing = () => {
        setStatus("analyzing");

        setTimeout(() => {
            setStatus("done");
        }, 4000);
    };

    const startOver = () => {
        setStatus("idle");
        setFile(null);
    };

    return (
        <>
            <Header />
            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
                {status === "idle" ? (
                    <UploadSection handleFileChange={handleFileChange} handleDragOver={handleDragOver} handleDragLeave={handleDragLeave} handleDrop={handleDrop} isDragging={isDragging} />
                ) : status === "uploading" ? (
                    <AnalyzeSection goBackToUpload={goBackToUpload} goToAnalyzing={goToAnalyzing} />
                ) : status === "analyzing" ? (
                    <AnalyzingSection />
                ) : (
                    <ResultSection startOver={startOver} />
                )}
            </div>
        </>
    );
}
