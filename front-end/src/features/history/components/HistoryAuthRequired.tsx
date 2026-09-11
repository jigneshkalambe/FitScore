import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function HistoryAuthRequired({ triggerLogin }: { triggerLogin: () => void }) {
    return (
        <div className="max-w-xl mx-auto text-center py-16 sm:py-24">
            <Card className="rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 bg-white">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Sign In to View History</h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
                    Your saved match analyses and role benchmarks are linked to your account. Log in or create an account to access your saved reports.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button className="w-full sm:w-auto px-6 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium" onClick={triggerLogin}>
                        Sign In to Account
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto px-6 h-11 rounded-xl border-slate-200">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </Card>
        </div>
    );
}
