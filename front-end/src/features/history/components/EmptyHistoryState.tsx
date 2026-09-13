import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderClock } from "lucide-react";
import Link from "next/link";

interface EmptyHistoryStateProps {
    searchQuery: string;
}

export default function EmptyHistoryState({ searchQuery }: EmptyHistoryStateProps) {
    return (
        <Card className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 p-6 sm:p-10 md:p-12 text-center bg-white/60">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3.5 sm:mb-4">
                <FolderClock className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">No saved analyses found</h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-5 sm:mb-6">
                {searchQuery ? "No matches found for your current search or filter criteria." : "You have not saved any resume-job analyses to your history yet."}
            </p>
            <Link href="/" className="w-full sm:w-auto inline-block">
                <Button variant="outline" className="w-full sm:w-auto rounded-xl border-slate-200 text-xs sm:text-sm h-10 px-5">
                    Analyze a Resume Now
                </Button>
            </Link>
        </Card>
    );
}
