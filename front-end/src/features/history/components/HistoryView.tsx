"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import HistoryAuthRequired from "./HistoryAuthRequired";
import SearchBar from "./SearchBar";
import EmptyHistoryState from "./EmptyHistoryState";

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
        return <HistoryAuthRequired triggerLogin={triggerLogin} />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            <Header isIdle={false} />

            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 flex-1 flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col gap-6 sm:gap-8">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                <Link href="/" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Scanner
                                </Link>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Analysis History</h1>
                            <p className="text-slate-500 text-xs sm:text-sm md:text-base mt-1">Review saved job matches, compare scores, and manage your analysis archive.</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs h-10 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5" onClick={() => router.push("/")}>
                                <Plus className="h-4 w-4" />
                                New Analysis
                            </Button>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterBand={filterBand} setFilterBand={setFilterBand} />

                    {/* History Cards Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <HistoryCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredList.length === 0 ? (
                        <EmptyHistoryState searchQuery={searchQuery} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
