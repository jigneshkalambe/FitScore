import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryCardSkeleton() {
    return (
        <Card className="rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col bg-white overflow-hidden py-3 sm:py-4">
            <CardHeader className="px-4 sm:px-6 pt-1 sm:pt-2 pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full shrink-0" />
                </div>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 pt-0 flex-1 flex flex-col justify-between gap-4 sm:gap-5">
                {/* Score & Progress */}
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
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
                <div className="flex items-center justify-between py-2 sm:py-2.5 border-y border-slate-100">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                    <Skeleton className="h-9 sm:h-10 w-9 sm:w-10 rounded-xl shrink-0" />
                    <Skeleton className="h-9 sm:h-10 flex-1 rounded-xl" />
                </div>
            </CardContent>
        </Card>
    );
}
