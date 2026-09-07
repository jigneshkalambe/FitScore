export type ScoreBand = {
    label: string;
    headline: string;
    subheading: string;
    colorHex: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    badgeClass: string;
};

export function getScoreBand(score: number): ScoreBand {
    if (score >= 85) {
        return {
            label: "Excellent match",
            headline: "You're a strong fit for this role.",
            subheading: "Your qualifications align closely with the key requirements and expectations.",
            colorHex: "#10b981",
            bgClass: "bg-emerald-500/10",
            borderClass: "border-emerald-500/30",
            textClass: "text-emerald-600",
            badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
    }
    if (score >= 65) {
        return {
            label: "Solid match",
            headline: "You're a strong candidate with room to grow.",
            subheading: "You meet most core requirements with a few specific skills or qualifications to highlight.",
            colorHex: "#2563eb",
            bgClass: "bg-blue-500/10",
            borderClass: "border-blue-500/30",
            textClass: "text-blue-600",
            badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
        };
    }
    if (score >= 40) {
        return {
            label: "Moderate match",
            headline: "You meet some key requirements for this position.",
            subheading: "You have relevant foundational experience, but bridging key gaps will improve your alignment.",
            colorHex: "#f59e0b",
            bgClass: "bg-amber-500/10",
            borderClass: "border-amber-500/30",
            textClass: "text-amber-600",
            badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
        };
    }
    return {
        label: "Stretch role",
        headline: "This role requires skills outside your current profile.",
        subheading: "There are notable gaps between this job description and your current resume.",
        colorHex: "#ef4444",
        bgClass: "bg-rose-500/10",
        borderClass: "border-rose-500/30",
        textClass: "text-rose-600",
        badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
    };
}
