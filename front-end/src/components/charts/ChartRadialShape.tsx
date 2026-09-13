"use client";

interface ChartRadialShapeProps {
    score: number;
    color?: string;
    size?: number;
    className?: string;
}

export function ChartRadialShape({ score, color = "#2563eb", size, className = "" }: ChartRadialShapeProps) {
    const radius = 42;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const clampedScore = Math.min(Math.max(score, 0), 100);
    const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

    return (
        <div
            className={`relative flex items-center justify-center shrink-0 aspect-square ${size ? "max-w-full max-h-full" : "w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52"} ${className}`}
            style={size ? { width: size, height: size, maxWidth: "100%", maxHeight: "100%" } : undefined}
        >
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle cx="50" cy="50" r={radius} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth={strokeWidth} fill="transparent" />
                {/* Progress track */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-none">
                    {clampedScore}
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-muted-foreground ml-0.5">%</span>
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground tracking-wider uppercase mt-0.5 sm:mt-1">Match Fit</span>
            </div>
        </div>
    );
}
