import { CloudUpload, LoaderCircle, Lock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChangeEvent, DragEvent } from "react";

interface UploadSectionProps {
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleDragOver: (event: DragEvent<HTMLDivElement>) => void;
    handleDragLeave: (event: DragEvent<HTMLDivElement>) => void;
    handleDrop: (event: DragEvent<HTMLDivElement>) => void;
    isDragging: boolean;
    isUploading: boolean;
}

export default function UploadSection({ handleFileChange, handleDragOver, handleDragLeave, handleDrop, isDragging, isUploading }: UploadSectionProps) {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 justify-center items-center text-center w-full max-w-4xl mx-auto px-2 sm:px-4">
            <span className="text-xs sm:text-sm md:text-base border border-gray-300 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full inline-flex items-center gap-1.5 sm:gap-2 text-slate-700 bg-white/80 shadow-xs">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 shrink-0" /> Make your next application count
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center max-w-3xl leading-[1.15] text-slate-900">
                Know your fit before you apply.
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-600 font-normal sm:font-medium max-w-2xl leading-relaxed px-2" id="how-it-works">
                FitScore compares your resume to the job description and gives you a score based on how well you match the requirements. It also provides suggestions on how to improve your resume to
                increase your chances of getting an interview.
            </p>
            <div className="w-full max-w-3xl rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-2 sm:p-3 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/30">
                {isUploading ? (
                    <>
                        <div className="flex min-h-[220px] sm:min-h-[280px] md:min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-blue-50 px-4 sm:px-6 py-8 sm:py-12 text-center shadow-sm transition-all duration-300">
                            <p className="flex items-center text-sm sm:text-base font-medium text-blue-700">
                                Uploading <LoaderCircle className="animate-spin w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                            </p>
                        </div>
                    </>
                ) : (
                    <div
                        className={`group flex min-h-[220px] sm:min-h-[280px] md:min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border bg-white px-4 sm:px-6 py-8 sm:py-12 text-center shadow-sm transition-all duration-300 ${
                            isDragging ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                        onClick={() => document.getElementById("fileInput")?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-blue-50 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-100">
                            <CloudUpload className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-blue-500 transition-transform duration-300 group-hover:-translate-y-1" />
                        </div>

                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900">{isDragging ? "Drop your resume here" : "Upload your resume"}</h3>

                        <p className="mt-1.5 sm:mt-2 max-w-md text-xs sm:text-sm leading-normal sm:leading-6 text-gray-500">
                            Drag & drop your resume here, or <span className="font-semibold text-blue-500">browse files</span>
                        </p>

                        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-400">
                            <Badge className="rounded-md font-medium text-[10px] sm:text-xs py-0.5 px-2">PDF</Badge>

                            <Badge className="rounded-md font-medium text-[10px] sm:text-xs py-0.5 px-2">DOCX</Badge>

                            <span className="text-gray-300">•</span>

                            <span>Max size 5MB</span>
                        </div>
                    </div>
                )}
            </div>
            <p className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 text-center px-2">
                <Lock className="inline-block h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                <span>Your files are safe with us. We do not store or share your resume.</span>
            </p>
        </div>
    );
}
