"use client";

import { useState } from "react";
import axios from "axios";
import { BadgeAlert, BadgeCheck, Bookmark, Check, CheckCircle2, FileText, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ChartRadialShape } from "./ChartRadialShape";
import { getScoreBand } from "@/lib/scoreBands";
import { useAuth } from "@/context/AuthContext";
import { saveAnalysis } from "@/lib/api/analysis";
import { toast } from "sonner";

interface AnalysisResult {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
}

interface ResultSectionProps {
    startOver: () => void;
    analysisResult: AnalysisResult | null;
    jdText?: string;
    fileName?: string;
}

export default function ResultSection({ startOver, analysisResult, jdText = "", fileName = "Resume" }: ResultSectionProps) {
    const { isAuthenticated } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const score = analysisResult?.score ?? 0;
    const matchedSkills = analysisResult?.matchedSkills ?? [];
    const missingSkills = analysisResult?.missingSkills ?? [];
    const summary = analysisResult?.summary ?? "";

    const scoreBand = getScoreBand(score);

    const totalIdentifiedSkills = matchedSkills.length + missingSkills.length;
    const matchPercentage = totalIdentifiedSkills > 0 ? Math.round((matchedSkills.length / totalIdentifiedSkills) * 100) : score;

    const handleSave = async () => {
        if (!isAuthenticated) {
            window.dispatchEvent(new CustomEvent("auth:open", { detail: { mode: "login" } }));
            toast.info("Please sign in or create an account to save your result.");
            return;
        }

        if (isSaved) {
            toast.info("This analysis has already been saved to your history.");
            return;
        }

        if (!analysisResult) return;

        setIsSaving(true);
        try {
            await saveAnalysis({
                label: fileName.replace(/\.[^/.]+$/, "") || "Role Match",
                jdText: jdText || "Job Description",
                score: analysisResult.score,
                matchedSkills: analysisResult.matchedSkills,
                missingSkills: analysisResult.missingSkills,
                summary: analysisResult.summary,
            });
            setIsSaved(true);
            toast.success("Analysis saved to your history successfully!");
        } catch (error: unknown) {
            let message = "Failed to save analysis. Please try again.";
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-6 sm:py-10">
            {/* Header / Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium px-2.5 py-0.5 text-xs rounded-full">
                            FitScore Report
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[240px]">
                            <FileText className="w-3.5 h-3.5" />
                            {fileName}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{scoreBand.headline}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">{scoreBand.subheading}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-slate-200 hover:bg-slate-50" onClick={startOver}>
                        <RotateCcw className="mr-2 h-4 w-4 text-muted-foreground" />
                        Start Over
                    </Button>

                    <Button
                        variant={isSaved ? "secondary" : "default"}
                        size="sm"
                        disabled={isSaving}
                        className={`h-10 px-4 rounded-xl font-medium ${isSaved ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                        onClick={handleSave}
                    >
                        {isSaved ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Saved
                            </>
                        ) : (
                            <>
                                <Bookmark className="mr-2 h-4 w-4" />
                                {isSaving ? "Saving..." : "Save Result"}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Hero Overview Card: Radial Score & AI Verdict */}
            <Card className="rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden bg-card">
                <CardContent className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Radial Gauge & Match Metric */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                            <ChartRadialShape score={score} color={scoreBand.colorHex} size={210} />

                            <div className="w-full mt-4 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-muted-foreground">Alignment Score</span>
                                    <span className={scoreBand.textClass}>{score}/100</span>
                                </div>
                                <Progress value={score} className="h-2 rounded-full bg-slate-200" />
                            </div>
                        </div>

                        {/* Assessment & Summary */}
                        <div className="lg:col-span-8 flex flex-col justify-center gap-5">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <Badge className={`rounded-full px-3 py-1 font-semibold text-xs border ${scoreBand.badgeClass}`}>{scoreBand.label}</Badge>
                                <span className="text-xs text-muted-foreground">Based on resume keywords & JD requirements</span>
                            </div>

                            {/* AI Summary Box */}
                            <div className="relative rounded-2xl bg-blue-50/50 border border-blue-100 p-5">
                                <div className="flex items-center gap-2 mb-2 text-blue-700 text-xs font-semibold tracking-wide uppercase">
                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                    AI Summary & Verdict
                                </div>
                                <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-normal">{summary || "No summary available for this analysis."}</p>
                            </div>

                            {/* Micro Metrics Strip */}
                            <div className="grid grid-cols-3 gap-3 pt-1">
                                <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs text-muted-foreground font-medium">Matched Skills</span>
                                    <span className="text-lg font-bold text-emerald-600 mt-0.5">{matchedSkills.length}</span>
                                </div>

                                <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs text-muted-foreground font-medium">Skill Gaps</span>
                                    <span className="text-lg font-bold text-amber-600 mt-0.5">{missingSkills.length}</span>
                                </div>

                                <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs text-muted-foreground font-medium">Keywords Coverage</span>
                                    <span className="text-lg font-bold text-blue-600 mt-0.5">{matchPercentage}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Skills Breakdown Grid (Matched vs Missing) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Matched Skills Card */}
                <Card className="rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="p-6 pb-4 bg-emerald-500/5 border-b border-emerald-500/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                                    <BadgeCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">Matched Skills</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-0.5">Qualifications verified in your resume</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                                {matchedSkills.length}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 flex-1 flex flex-col">
                        {matchedSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-2.5">
                                {matchedSkills.map((skill, index) => (
                                    <Badge
                                        key={`${skill}-${index}`}
                                        variant="outline"
                                        className="py-1.5 px-3 rounded-xl border-emerald-200 bg-emerald-50/50 text-emerald-800 font-medium text-xs sm:text-sm flex items-center gap-1.5"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                <BadgeAlert className="w-8 h-8 mb-2 opacity-40" />
                                <p className="text-sm">No direct matching skills detected.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Missing Skills Card */}
                <Card className="rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="p-6 pb-4 bg-amber-500/5 border-b border-amber-500/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                                    <BadgeAlert className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">Key Missing Skills & Gaps</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-0.5">Requirements not found in your resume</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
                                {missingSkills.length}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 flex-1 flex flex-col">
                        {missingSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-2.5">
                                {missingSkills.map((skill, index) => (
                                    <Badge
                                        key={`${skill}-${index}`}
                                        variant="outline"
                                        className="py-1.5 px-3 rounded-xl border-amber-200 bg-amber-50/50 text-amber-900 font-medium text-xs sm:text-sm flex items-center gap-1.5"
                                    >
                                        <BadgeAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-emerald-600">
                                <CheckCircle2 className="w-8 h-8 mb-2" />
                                <p className="text-sm font-medium">All listed requirements are covered in your profile!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Save & History Banner */}
            <Card className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 via-blue-50/20 to-slate-50 shadow-sm">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                            <Bookmark className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-base sm:text-lg text-foreground">
                                {isAuthenticated ? (isSaved ? "This result is saved to your account" : "Save this match report") : "Keep your results accessible anywhere"}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                {isAuthenticated
                                    ? "Saved analyses can be referenced and reviewed anytime from your account history."
                                    : "Sign in or register for free to save your match scores, track applications, and benchmark roles."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <Button
                            variant={isSaved ? "secondary" : "default"}
                            disabled={isSaving}
                            className={`rounded-xl px-5 h-11 font-medium shrink-0 w-full sm:w-auto ${isSaved ? "bg-emerald-50 text-emerald-700" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                            onClick={handleSave}
                        >
                            {isSaved ? (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Saved to History
                                </>
                            ) : (
                                <>
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    {isSaving ? "Saving..." : isAuthenticated ? "Save to History" : "Sign In & Save"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
