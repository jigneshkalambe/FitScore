import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default function HistoryAuthRequired({ triggerLogin }: { triggerLogin: () => void }) {
    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            <Header isIdle={false} />
            <main className="w-full max-w-xl mx-auto px-4 py-10 sm:py-16 md:py-20 flex-1 flex items-center justify-center">
                <Card className="rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 md:p-10 bg-white text-center w-full">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                        <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2.5 sm:mb-3">Sign In to View History</h2>
                    <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto">
                        Your saved match analyses and role benchmarks are linked to your account. Log in or create an account to access your saved reports.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                        <Button className="w-full sm:w-auto px-6 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm" onClick={triggerLogin}>
                            Sign In to Account
                        </Button>
                        <Link href="/" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full px-6 h-11 rounded-xl border-slate-200 text-xs sm:text-sm">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </Card>
            </main>
        </div>
    );
}
