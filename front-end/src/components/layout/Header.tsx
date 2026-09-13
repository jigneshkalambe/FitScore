"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { History, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import AuthDialog from "@/features/auth/components/AuthDialog";

export default function Header({ isIdle }: { isIdle: boolean }) {
    const [openAuthDialog, setOpenAuthDialog] = useState<boolean>(false);
    const [mode, setMode] = useState<"login" | "register">("login");
    const { isAuthenticated, logout, isLoading } = useAuth();
    const router = useRouter();

    const handleHowItWorksClick = () => {
        const howItWorksSection = document.getElementById("how-it-works");
        if (howItWorksSection) {
            howItWorksSection.scrollIntoView({ behavior: "smooth", block: "center" });
            howItWorksSection.style.border = "1px solid #3b82f6";
            howItWorksSection.style.borderRadius = "8px";
            howItWorksSection.style.padding = "8px";
            howItWorksSection.style.transition = "all 0.2s linear";
            setTimeout(() => {
                howItWorksSection.style.border = "";
                howItWorksSection.style.borderRadius = "";
                howItWorksSection.style.padding = "";
            }, 2000);
        }
    };

    useEffect(() => {
        const handleSessionExpired = () => {
            setOpenAuthDialog(true);
            setMode("login");
            // toast.error("Your session expired. Please log in again.");
        };

        const handleOpenAuth = (e: Event) => {
            const customEvent = e as CustomEvent<{ mode?: "login" | "register" }>;
            setMode(customEvent.detail?.mode || "login");
            setOpenAuthDialog(true);
        };

        window.addEventListener("auth:session-expired", handleSessionExpired);
        window.addEventListener("auth:open", handleOpenAuth);
        return () => {
            window.removeEventListener("auth:session-expired", handleSessionExpired);
            window.removeEventListener("auth:open", handleOpenAuth);
        };
    }, []);

    return (
        <>
            <div className="border-b border-b-slate-200 py-3 sm:py-4 px-4 sm:px-6 bg-white">
                <div className="flex gap-2 sm:gap-5 w-full max-w-7xl mx-auto items-center justify-between">
                    <div className="shrink-0">
                        <Link href="/" className="gap-1.5 sm:gap-2 bg-blue-500 hover:bg-blue-600 transition-colors px-2.5 sm:px-3 py-1 rounded-full items-center font-bold text-sm sm:text-base text-white inline-flex shrink-0">
                            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" /> FitScore
                        </Link>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="inline-flex gap-2 sm:gap-3 items-center">
                            {isIdle && (
                                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs sm:text-sm" onClick={handleHowItWorksClick}>
                                    How it works
                                </Button>
                            )}

                            {isLoading ? (
                                <div className="flex gap-2">
                                    <div className="w-14 sm:w-16 h-8 bg-slate-100 animate-pulse rounded-xl" />
                                    <div className="w-14 sm:w-16 h-8 bg-slate-100 animate-pulse rounded-xl" />
                                </div>
                            ) : isAuthenticated ? (
                                <>
                                    <Button variant="ghost" size="sm" className="gap-1 sm:gap-1.5 flex text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9" onClick={() => router.push("/history")}>
                                        <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        History
                                    </Button>
                                    <Button variant="destructive" size="sm" className="rounded-xl text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9" onClick={logout}>
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-slate-200 text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9"
                                        onClick={() => {
                                            setMode("login");
                                            setOpenAuthDialog(true);
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9"
                                        onClick={() => {
                                            setMode("register");
                                            setOpenAuthDialog(true);
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AuthDialog open={openAuthDialog} onOpenChange={setOpenAuthDialog} mode={mode} setMode={setMode} />
        </>
    );
}
