import { ArrowRight, FileText } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";

export default function AnalyzeSection({
    goBackToUpload,
    AnalyzeContent,
    extractedText,
    setExtractedText,
    fileName,
    jdText,
    setJdText,
}: {
    goBackToUpload: () => void;
    AnalyzeContent: () => void;
    extractedText: string;
    setExtractedText: (text: string) => void;
    fileName: string | undefined;
    jdText: string;
    setJdText: (text: string) => void;
}) {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 w-full">
            <div className="flex flex-col gap-1.5 sm:gap-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">Add the role you want.</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">We extracted your resume. Review it, then paste the job description you are considering.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
                <div className="flex flex-col border border-gray-300 rounded-2xl h-[350px] sm:h-[420px] lg:h-[500px] overflow-hidden bg-white shadow-xs">
                    <div className="min-h-[64px] sm:min-h-[76px] border-b border-b-gray-200 flex items-center px-4 sm:px-6 justify-between gap-3">
                        <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
                            <p className="text-base sm:text-lg font-semibold text-slate-900">Your resume</p>
                            <span className="text-xs sm:text-sm flex items-center gap-1.5 text-gray-500 truncate">
                                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                <span className="truncate">{fileName || "filename.pdf"}</span>
                            </span>
                        </div>
                        <Button
                            variant={"link"}
                            className={"text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium px-2 shrink-0"}
                            onClick={() => {
                                const fileInput = document.getElementById("fileInput");
                                if (fileInput) {
                                    fileInput.click();
                                }
                            }}
                        >
                            Replace
                        </Button>
                    </div>
                    <div className="flex-1 min-h-0 min-w-0">
                        <Textarea
                            className="w-full h-full min-w-0 max-w-full resize-none rounded-none! border-0! outline-none! ring-0! p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed"
                            value={extractedText}
                            onChange={(e) => setExtractedText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col border border-gray-300 rounded-2xl h-[350px] sm:h-[420px] lg:h-[500px] overflow-hidden bg-white shadow-xs">
                    <div className="min-h-[64px] sm:min-h-[76px] border-b border-b-gray-200 flex items-center px-4 sm:px-6 justify-between gap-3">
                        <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
                            <p className="text-base sm:text-lg font-semibold text-slate-900">Job description</p>
                            <span className="text-xs sm:text-sm flex items-center gap-1.5 text-gray-500 truncate">
                                Paste the full description for the most accurate score.
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 min-w-0">
                        <Textarea
                            className="w-full h-full resize-none rounded-none! border-0! outline-none! ring-0! p-3 sm:p-4 text-xs sm:text-sm leading-relaxed"
                            placeholder="Paste the job description here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2">
                <Button
                    variant={"ghost"}
                    size="sm"
                    className="h-10 sm:h-11 px-4 sm:px-5 text-xs sm:text-sm rounded-xl font-medium"
                    onClick={goBackToUpload}
                >
                    Back
                </Button>
                <Button
                    variant={"default"}
                    size="sm"
                    className="h-10 sm:h-11 px-5 sm:px-6 text-xs sm:text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2"
                    onClick={AnalyzeContent}
                >
                    Analyze <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
