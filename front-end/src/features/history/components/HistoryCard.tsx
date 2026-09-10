import { BadgeAlert, BadgeCheck, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { SavedAnalysis } from "./HistoryView";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import { ScoreBand } from "@/lib/scoreBands";

interface HistoryCardProps {
    item: SavedAnalysis;
    band: ScoreBand;
    deleteHistoryItem: (id: string) => void;
    setSelectedAnalysis: (item: SavedAnalysis) => void;
    formatDate: (dateString: string) => string;
}

export default function HistoryCard({ item, band, deleteHistoryItem, setSelectedAnalysis, formatDate }: HistoryCardProps) {
    return (
        <Card className="rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col bg-white overflow-hidden py-4">
            <CardHeader className="">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {formatDate(item.createdAt)}
                        </span>
                        {/* Removed truncate, added break-words and [overflow-wrap:anywhere] */}
                        <CardTitle className="text-lg font-bold text-slate-900 wrap-break-word leading-snug">{item.label || "Untitled Role Match"}</CardTitle>
                    </div>

                    <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 border ${band.badgeClass}`}>{band.label}</Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col justify-between gap-5">
                {/* Score & Progress */}
                <div className="rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 p-4">
                    <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-500">FitScore Match</span>
                        <span className={`text-base font-extrabold ${band.textClass}`}>{item.score}%</span>
                    </div>
                    <Progress value={item.score} className="h-2 rounded-full bg-slate-200" />
                </div>

                {/* Summary snippet */}
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">{item.summary}</p>

                {/* Matched / Missing Skill Counts */}
                <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        {item.matchedSkills.length} Matched
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                        <BadgeAlert className="w-4 h-4 text-amber-600 shrink-0" />
                        {item.missingSkills.length} Gaps
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-9 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-none"
                        onClick={() => deleteHistoryItem(item._id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-xl border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium flex-1 justify-center"
                        onClick={() => setSelectedAnalysis(item)}
                    >
                        View Report
                        <ChevronRight className="ml-1.5 w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
