"use client";

interface ChartRadialShapeProps {
    score: number;
    color?: string;
    size?: number;
}

export function ChartRadialShape({ score, color = "#2563eb", size = 200 }: ChartRadialShapeProps) {
    const strokeWidth = 14;
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedScore = Math.min(Math.max(score, 0), 100);
    const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                {/* Background track */}
                <circle cx={size / 2} cy={size / 2} r={radius} className="stroke-slate-100" strokeWidth={strokeWidth} fill="transparent" />
                {/* Progress track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
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
            <div className="absolute flex flex-col items-center justify-center text-center select-none">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                    {clampedScore}
                    <span className="text-2xl font-semibold text-muted-foreground">%</span>
                </span>
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mt-1">Match Fit</span>
            </div>
        </div>
    );
}
