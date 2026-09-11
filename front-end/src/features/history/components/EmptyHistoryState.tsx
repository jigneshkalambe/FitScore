import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderClock } from "lucide-react";
import Link from "next/link";

interface EmptyHistoryStateProps {
    searchQuery: string;
}

export default function EmptyHistoryState({ searchQuery }: EmptyHistoryStateProps) {
    return (
        <Card className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-white/60">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <FolderClock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No saved analyses found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                {searchQuery ? "No matches found for your current search or filter criteria." : "You have not saved any resume-job analyses to your history yet."}
            </p>
            <Button variant="outline" className="rounded-xl border-slate-200">
                <Link href="/">Analyze a Resume Now</Link>
            </Button>
        </Card>
    );
}
