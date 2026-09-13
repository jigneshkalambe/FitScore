import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SavedAnalysis } from "./HistoryView";
import { ChartRadialShape } from "../../../components/charts/ChartRadialShape";
import { BadgeAlert, BadgeCheck, FileText } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ScoreBand } from "@/lib/scoreBands";

interface HistoryPreviewDialogProps {
    selectedAnalysis: SavedAnalysis | null;
    setSelectedAnalysis: (analysis: SavedAnalysis | null) => void;
    formatDate: (dateString: string) => string;
    getScoreBand: (score: number) => ScoreBand;
}

export default function HistoryPreviewDialog({ selectedAnalysis, setSelectedAnalysis, formatDate, getScoreBand }: HistoryPreviewDialogProps) {
    return (
        <Dialog open={!!selectedAnalysis} onOpenChange={(open) => !open && setSelectedAnalysis(null)}>
            <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6">
                {selectedAnalysis && (
                    <>
                        <DialogHeader className="pb-3 sm:pb-4 border-b border-slate-200">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium px-2.5 py-0.5 text-xs rounded-full">
                                    Saved Report
                                </Badge>
                                <span className="text-xs text-slate-400">{formatDate(selectedAnalysis.createdAt)}</span>
                            </div>
                            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">{selectedAnalysis.label}</DialogTitle>
                            <DialogDescription className="text-slate-500 text-xs sm:text-sm">Full match breakdown and skill alignment analysis.</DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-5 sm:gap-6 py-3 sm:py-4">
                            {/* Score & Verdict Overview */}
                            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                                <ChartRadialShape score={selectedAnalysis.score} color={getScoreBand(selectedAnalysis.score).colorHex} className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 shrink-0" />
                                <div className="flex flex-col items-center sm:items-start gap-2 min-w-0">
                                    <Badge className={`w-fit rounded-full px-3 py-1 font-semibold text-xs border ${getScoreBand(selectedAnalysis.score).badgeClass}`}>
                                        {getScoreBand(selectedAnalysis.score).label}
                                    </Badge>
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg">{getScoreBand(selectedAnalysis.score).headline}</h4>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{selectedAnalysis.summary}</p>
                                </div>
                            </div>

                            {/* Matched Skills */}
                            <div className="flex flex-col gap-2.5 sm:gap-3">
                                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                                    Matched Skills ({selectedAnalysis.matchedSkills.length})
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {selectedAnalysis.matchedSkills.map((skill, idx) => (
                                        <Badge key={`${skill}-${idx}`} variant="outline" className="py-1 px-2.5 sm:px-3 rounded-lg border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-medium break-words max-w-full">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Missing Skills */}
                            <div className="flex flex-col gap-2.5 sm:gap-3">
                                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs sm:text-sm">
                                    <BadgeAlert className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                                    Missing Skills & Gaps ({selectedAnalysis.missingSkills.length})
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {selectedAnalysis.missingSkills.map((skill, idx) => (
                                        <Badge key={`${skill}-${idx}`} variant="outline" className="py-1 px-2.5 sm:px-3 rounded-lg border-amber-200 bg-amber-50 text-amber-900 text-[11px] sm:text-xs font-medium break-words max-w-full">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Job Description Excerpt */}
                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 shrink-0" /> Job Description Reference
                                </span>
                                <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono max-h-36 sm:max-h-48 overflow-y-auto whitespace-pre-wrap break-words">
                                    {selectedAnalysis.jdText}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-3 sm:pt-4 border-t border-slate-200">
                            <Button variant="outline" className="rounded-xl w-full sm:w-auto h-10 text-xs sm:text-sm" onClick={() => setSelectedAnalysis(null)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
