"use client";

import { Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import AuthDialog from "./auth/AuthDialog";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const [openAuthDialog, setOpenAuthDialog] = useState<boolean>(false);
    const [mode, setMode] = useState<"login" | "register">("login");
    const { isAuthenticated, logout } = useAuth();

    const handleHowItWorksClick = () => {
        const howItWorksSection = document.getElementById("how-it-works");
        if (howItWorksSection) {
            howItWorksSection.scrollIntoView({ behavior: "smooth", block: "center" });
            howItWorksSection.style.border = "1px solid #3b82f6"; // Light blue border
            howItWorksSection.style.borderRadius = "8px"; // Rounded corners
            howItWorksSection.style.padding = "8px"; // Padding for better visibility
            howItWorksSection.style.transition = "all 0.2s linear"; // Smooth transition for border
            setTimeout(() => {
                howItWorksSection.style.border = ""; // Reset border after 2 seconds
                howItWorksSection.style.borderRadius = ""; // Reset border radius
                howItWorksSection.style.padding = ""; // Reset padding
            }, 2000);
        }
    };

    useEffect(() => {
        const handleUnauthorized = () => {
            setOpenAuthDialog(true);
            setMode("login");
            toast.error("Your session expired. Please log in again.");
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
    }, []);

    return (
        <>
            <div className="border-b border-b-slate-200 py-4 px-6">
                <div className="flex gap-5 w-full max-w-7xl mx-auto items-center">
                    <div className="flex-grow">
                        <span className="gap-2 bg-blue-500 px-3 py-1 rounded-full items-center  font-bold text-base text-white inline-flex">
                            <Zap className="h-6 w-6 text-white" /> FitScore
                        </span>
                    </div>
                    <div className="flex-grow flex justify-end">
                        <div className="inline-flex gap-4 items-center">
                            <Button variant="ghost" onClick={handleHowItWorksClick}>
                                How it works
                            </Button>
                            {isAuthenticated ? (
                                <Button variant="destructive" onClick={logout}>
                                    Sign Out
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setMode("login");
                                            setOpenAuthDialog(true);
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="outline"
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
