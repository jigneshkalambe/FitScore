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
        <div className="flex flex-col gap-8 justify-center items-center">
            <span className="text-base border border-gray-300 px-5 py-2 rounded-4xl inline-flex  items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-500" /> Make your next application count
            </span>
            <h1 className="text-7xl font-bold max-w-3xl text-center">Know your fit before you apply.</h1>
            <p className="text-xl text-center text-gray-600 font-medium" id="how-it-works">
                FitScore compares your resume to the job description and gives you a score based on how well you match the requirements. It also provides suggestions on how to improve your resume to
                increase your chances of getting an interview.
            </p>
            <div className="w-full max-w-3xl rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-3 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/30">
                {isUploading ? (
                    <>
                        <div className="flex min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-blue-50 px-6 py-12 text-center shadow-sm transition-all duration-300">
                            <p className="flex items-center">
                                Uploading <LoaderCircle className="animate-spin w-5 h-5 ml-1" />
                            </p>
                        </div>
                    </>
                ) : (
                    <div
                        className={`group flex min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border bg-white px-6 py-12 text-center shadow-sm transition-all duration-300 ${
                            isDragging ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                        onClick={() => document.getElementById("fileInput")?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-100">
                            <CloudUpload className="h-10 w-10 text-blue-500 transition-transform duration-300 group-hover:-translate-y-1" />
                        </div>

                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">{isDragging ? "Drop your resume here" : "Upload your resume"}</h3>

                        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Drag & drop your resume here, or <span className="font-semibold text-blue-500">browse files</span>
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                            <Badge className="rounded-md font-medium">PDF</Badge>

                            <Badge className="rounded-md font-medium">DOCX</Badge>

                            <span className="text-gray-300">•</span>

                            <span>Max size 5MB</span>
                        </div>
                    </div>
                )}
            </div>
            <p className="flex items-center gap-2">
                <Lock className="inline-block h-6 w-6 text-gray-400" /> Your files are safe with us. We do not store or share your resume.
            </p>
        </div>
    );
}
