import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterBand: string;
    setFilterBand: (band: string) => void;
}
export default function SearchBar({ searchQuery, setSearchQuery, filterBand, setFilterBand }: SearchBarProps) {
    return (
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
    );
}
