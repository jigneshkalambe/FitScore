import { Card, CardHeader, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function HistoryCardSkeleton() {
    return (
        <Card className="rounded-3xl border border-slate-200/90 shadow-xs flex flex-col bg-white overflow-hidden">
            <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full shrink-0" />
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0 flex-1 flex flex-col justify-between gap-5">
                {/* Score & Progress */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>

                {/* Summary snippet */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-3/4" />
                </div>

                {/* Matched / Missing Skill Counts */}
                <div className="flex items-center justify-between py-2 border-y border-slate-100">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                    <Skeleton className="h-9 w-9 rounded-xl" />
                    <Skeleton className="h-9 flex-1 rounded-xl" />
                </div>
            </CardContent>
        </Card>
    );
}
