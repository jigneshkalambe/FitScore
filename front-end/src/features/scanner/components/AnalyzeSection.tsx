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
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
                <h2 className="text-4xl font-semibold">Add the role you want.</h2>
                <p>We extracted your resume. Review it, then paste the job description you considering.</p>
            </div>
            <div className="flex gap-6">
                <div className="flex-1 flex flex-col border border-gray-300 rounded-2xl h-[500px] overflow-hidden">
                    <div className="min-h-[80px] border-b-1 border-b-gray-300 flex items-center px-6 justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold">Your resume</p>
                            <span className="text-sm flex items-center gap-2 text-gray-500 truncate">
                                <FileText className="w-4 h-4" /> {fileName || "filename.pdf"}
                            </span>
                        </div>
                        <Button
                            variant={"link"}
                            className={"text-blue-500"}
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
                            className="w-full h-full min-w-0 max-w-full resize-none rounded-none! border-0! outline-none! ring-0! p-4"
                            value={extractedText}
                            onChange={(e) => setExtractedText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 flex flex-col border border-gray-300 rounded-2xl h-[500px] overflow-hidden">
                    <div className="min-h-[80px] border-b-1 border-b-gray-300 flex items-center px-6">
                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold">Job description</p>
                            <span className="text-sm flex items-center gap-2 text-gray-500">Paste the full description for the most accurate score.</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 min-w-0">
                        <Textarea
                            className="w-full h-full resize-none rounded-none! border-0! outline-none! ring-0! p-4"
                            placeholder="Paste the job description here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <Button className="" variant={"ghost"} onClick={goBackToUpload}>
                    back
                </Button>
                <Button className="" variant={"default"} onClick={AnalyzeContent}>
                    Analyze <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
