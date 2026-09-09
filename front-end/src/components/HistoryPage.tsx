"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeAlert, BadgeCheck, Calendar, ChevronRight, FileText, FolderClock, Lock, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "@/components/Header";
import { ChartRadialShape } from "@/components/ChartRadialShape";
import { getScoreBand } from "@/lib/scoreBands";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { deleteAnalysis, getHistory } from "@/lib/api/analysis";
import HistoryCardSkeleton from "./HistoryCardSkeleton";
import { toast } from "sonner";

export interface SavedAnalysis {
    _id: string;
    label: string;
    jdText: string;
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
    createdAt: string;
}

export default function HistoryPage() {
    const { isAuthenticated } = useAuth();

    // UI & Local State variables (No API calls wired yet)
    const [historyList, setHistoryList] = useState<SavedAnalysis[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterBand, setFilterBand] = useState<string>("all");
    const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
    const [analysisToDelete, setAnalysisToDelete] = useState<SavedAnalysis | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const filteredList = historyList.filter((item) => {
        const matchesQuery =
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
            item.missingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesQuery) return false;

        if (filterBand === "all") return true;
        if (filterBand === "excellent") return item.score >= 85;
        if (filterBand === "solid") return item.score >= 65 && item.score < 85;
        if (filterBand === "moderate") return item.score >= 40 && item.score < 65;
        if (filterBand === "stretch") return item.score < 40;
        return true;
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getHistory();
                const data = response.data;
                console.log("history Data: ", data);
                setHistoryList(data);
            } catch (err: any) {
                // setError(err?.response?.data?.message || "Could not load history");
                toast.error(err?.response?.data?.message || "Could not load history");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleDelete = () => {
        if (!analysisToDelete) return;
        setIsDeleting(true);

        // Dummy deletion from local state for layout testing
        setHistoryList((prev) => prev.filter((item) => item._id !== analysisToDelete._id));
        setIsDeleting(false);
        setAnalysisToDelete(null);
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const triggerLogin = () => {
        window.dispatchEvent(new CustomEvent("auth:open", { detail: { mode: "login" } }));
    };

    const deleteHistoryItem = async (id: string) => {
        try {
            await deleteAnalysis(id);
            setHistoryList((prev) => prev.filter((item) => item._id !== id));
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Could not delete analysis");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-xl mx-auto text-center py-16 sm:py-24">
                <Card className="rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 bg-white">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Sign In to View History</h2>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
                        Your saved match analyses and role benchmarks are linked to your account. Log in or create an account to access your saved reports.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button className="w-full sm:w-auto px-6 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium" onClick={triggerLogin}>
                            Sign In to Account
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto px-6 h-11 rounded-xl border-slate-200">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Header isIdle={false} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col gap-8">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Link href="/" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Scanner
                                </Link>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Analysis History</h1>
                            <p className="text-slate-500 text-sm sm:text-base mt-1">Review saved job matches, compare scores, and manage your analysis archive.</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Button className=" bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm" onClick={() => router.push("/")}>
                                <Plus className="mr-1 h-4 w-4" />
                                New Analysis
                            </Button>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                placeholder="Search by role or skill keyword..."
                                className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { id: "all", label: "All Scores" },
                                { id: "excellent", label: "85%+ (Excellent)" },
                                { id: "solid", label: "65-84% (Solid)" },
                                { id: "moderate", label: "40-64% (Moderate)" },
                                { id: "stretch", label: "<40% (Stretch)" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilterBand(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        filterBand === tab.id ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* History Cards Grid */}
                    {filteredList.length === 0 ? (
                        <Card className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-white/60">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                                <FolderClock className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No saved analyses found</h3>
                            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                                {searchQuery ? "No matches found for your current search or filter criteria." : "You have not saved any resume-job analyses to your history yet."}
                            </p>
                            <Button variant="outline" className="rounded-xl border-slate-200">
                                <Link href="/">Analyze a Resume Now</Link>
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => <HistoryCardSkeleton key={i} />)
                                : filteredList.map((item) => {
                                      const band = getScoreBand(item.score);
                                      return (
                                          <Card
                                              key={item._id}
                                              className="rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col bg-white overflow-hidden"
                                          >
                                              <CardHeader className="p-6 pb-4">
                                                  <div className="flex items-start justify-between gap-3">
                                                      <div className="flex flex-col gap-1 min-w-0">
                                                          <span className="text-xs text-slate-400 flex items-center gap-1">
                                                              <Calendar className="w-3.5 h-3.5" />
                                                              {formatDate(item.createdAt)}
                                                          </span>
                                                          <CardTitle className="text-lg font-bold text-slate-900 truncate wrap-break-word">{item.label || "Untitled Role Match"}</CardTitle>
                                                      </div>

                                                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 border ${band.badgeClass}`}>{band.label}</Badge>
                                                  </div>
                                              </CardHeader>

                                              <CardContent className="px-6 pb-6 pt-0 flex-1 flex flex-col justify-between gap-5">
                                                  {/* Score & Progress */}
                                                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
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
                                                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                                                          {item.matchedSkills.length} Matched
                                                      </span>
                                                      <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                                                          <BadgeAlert className="w-4 h-4 text-amber-600" />
                                                          {item.missingSkills.length} Gaps
                                                      </span>
                                                  </div>

                                                  {/* Action Buttons */}
                                                  <div className="flex items-center justify-between gap-2 pt-1">
                                                      <Button variant="destructive" onClick={() => deleteHistoryItem(item._id)}>
                                                          <Trash2 className="w-4 h-4" />
                                                      </Button>

                                                      <Button
                                                          variant="outline"
                                                          //   size="sm"
                                                          className=" border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium flex-1 justify-center"
                                                          onClick={() => setSelectedAnalysis(item)}
                                                      >
                                                          View Report
                                                          <ChevronRight className="ml-1.5 w-4 h-4" />
                                                      </Button>
                                                  </div>
                                              </CardContent>
                                          </Card>
                                      );
                                  })}
                        </div>
                    )}
                </div>
            </main>

            <Dialog open={!!selectedAnalysis} onOpenChange={(open) => !open && setSelectedAnalysis(null)}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-8 rounded-2xl sm:rounded-3xl">
                    {selectedAnalysis && (
                        <>
                            <DialogHeader className="pb-4 border-b border-slate-200">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium px-2.5 py-0.5 text-xs rounded-full">
                                        Saved Report
                                    </Badge>
                                    <span className="text-xs text-slate-400">{formatDate(selectedAnalysis.createdAt)}</span>
                                </div>
                                <DialogTitle className="text-xl sm:text-3xl font-bold text-slate-900 wrap-break-word">{selectedAnalysis.label}</DialogTitle>
                                <DialogDescription className="text-slate-500 text-sm">Full match breakdown and skill alignment analysis.</DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col gap-6 py-4">
                                {/* Score & Verdict Overview */}
                                <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                                    <ChartRadialShape score={selectedAnalysis.score} color={getScoreBand(selectedAnalysis.score).colorHex} size={120} className="sm:hidden" />
                                    <ChartRadialShape score={selectedAnalysis.score} color={getScoreBand(selectedAnalysis.score).colorHex} size={160} className="hidden sm:block" />
                                    <div className="flex flex-col items-center sm:items-start gap-2 min-w-0">
                                        <Badge className={`w-fit rounded-full px-3 py-1 font-semibold text-xs border ${getScoreBand(selectedAnalysis.score).badgeClass}`}>
                                            {getScoreBand(selectedAnalysis.score).label}
                                        </Badge>
                                        <h4 className="font-bold text-slate-900 text-base sm:text-lg">{getScoreBand(selectedAnalysis.score).headline}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{selectedAnalysis.summary}</p>
                                    </div>
                                </div>

                                {/* Matched Skills */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                                        <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                        Matched Skills ({selectedAnalysis.matchedSkills.length})
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAnalysis.matchedSkills.map((skill, idx) => (
                                            <Badge key={`${skill}-${idx}`} variant="outline" className="py-1 px-3 rounded-lg border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                                        <BadgeAlert className="w-5 h-5 text-amber-600 shrink-0" />
                                        Missing Skills & Gaps ({selectedAnalysis.missingSkills.length})
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAnalysis.missingSkills.map((skill, idx) => (
                                            <Badge key={`${skill}-${idx}`} variant="outline" className="py-1 px-3 rounded-lg border-amber-200 bg-amber-50 text-amber-900 text-xs font-medium">
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
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap wrap-break-word">
                                        {selectedAnalysis.jdText}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="pt-2 border-t border-slate-200">
                                <Button variant="outline" className="rounded-xl w-full sm:w-auto" onClick={() => setSelectedAnalysis(null)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION MODAL */}
            <Dialog open={!!analysisToDelete} onOpenChange={(open) => !open && setAnalysisToDelete(null)}>
                <DialogContent className="max-w-md p-6 rounded-3xl">
                    <DialogHeader>
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-2">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Delete Analysis Record?</DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm">
                            Are you sure you want to remove the saved report for <span className="font-semibold text-slate-700">&quot;{analysisToDelete?.label}&quot;</span>? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4">
                        <Button variant="outline" className="rounded-xl" disabled={isDeleting} onClick={() => setAnalysisToDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium" disabled={isDeleting} onClick={handleDelete}>
                            {isDeleting ? "Deleting..." : "Delete Analysis"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
