"use client";

import { Zap } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
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

    return (
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
                        <Button variant="outline">Sign In</Button>
                        <Button variant="outline">Sign Up</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
