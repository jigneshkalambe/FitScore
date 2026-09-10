"use client";
import { useEffect, useState } from "react";

const steps = ["Reading your resume", "Comparing against the job description", "Calculating your match score"];

export default function AnalyzingSection() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-8 py-20">
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-2 border-muted" />
                <div className="absolute inset-0 rounded-full border-2 border-t-foreground animate-spin" />
            </div>

            <div className="flex flex-col items-center gap-3">
                {steps.map((step, index) => (
                    <p
                        key={step}
                        className={`text-sm transition-colors duration-500 ${
                            index === activeStep ? "text-foreground font-medium" : index < activeStep ? "text-muted-foreground line-through decoration-1" : "text-muted-foreground/40"
                        }`}
                    >
                        {step}
                    </p>
                ))}
            </div>
        </div>
    );
}
