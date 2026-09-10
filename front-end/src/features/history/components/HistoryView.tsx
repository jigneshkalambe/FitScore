"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderClock, Lock, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getScoreBand } from "@/lib/scoreBands";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { deleteAnalysis, getHistory } from "@/lib/api/analysis";
import { toast } from "sonner";
import HistoryCard from "./HistoryCard";
import HistoryPreviewDialog from "./HistoryPreviewDialog";
import DeleteAnalysisDialog from "./DeleteAnalysisDialog";
import HistoryCardSkeleton from "./HistoryCardSkeleton";
import Header from "@/components/layout/Header";

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
            if (!id) return;
            setIsDeleting(true);
            await deleteAnalysis(id);
            setHistoryList((prev) => prev.filter((item) => item._id !== id));
            setAnalysisToDelete(null);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Could not delete analysis");
        } finally {
            setIsDeleting(false);
            setAnalysisToDelete(null);
        }
    };

    if (!isAuthenticated && !isLoading) {
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
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <HistoryCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredList.length === 0 ? (
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
                            {filteredList.map((item) => {
                                const band = getScoreBand(item.score);
                                return (
                                    <HistoryCard
                                        key={item._id}
                                        item={item}
                                        band={band}
                                        setSelectedAnalysis={setSelectedAnalysis}
                                        deleteHistoryItem={() => {
                                            setAnalysisToDelete(item);
                                        }}
                                        formatDate={formatDate}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* ANALYSIS PREVIEW MODAL */}
            <HistoryPreviewDialog selectedAnalysis={selectedAnalysis} setSelectedAnalysis={setSelectedAnalysis} formatDate={formatDate} getScoreBand={getScoreBand} />

            {/* DELETE CONFIRMATION MODAL */}
            <DeleteAnalysisDialog analysisToDelete={analysisToDelete} setAnalysisToDelete={setAnalysisToDelete} deleteHistoryItem={deleteHistoryItem} isDeleting={isDeleting} />
        </div>
    );
}
