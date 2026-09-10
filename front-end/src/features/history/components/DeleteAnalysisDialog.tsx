import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { SavedAnalysis } from "./HistoryView";

interface DeleteAnalysisDialogProps {
    analysisToDelete: SavedAnalysis | null;
    setAnalysisToDelete: (analysis: SavedAnalysis | null) => void;
    deleteHistoryItem: (id: string) => void;
    isDeleting: boolean;
}

export default function DeleteAnalysisDialog({ analysisToDelete, setAnalysisToDelete, deleteHistoryItem, isDeleting }: DeleteAnalysisDialogProps) {
    return (
        <Dialog open={!!analysisToDelete} onOpenChange={(open) => !open && setAnalysisToDelete(null)}>
            <DialogContent className="sm:max-w-md  rounded-3xl">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-2">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900">Delete Analysis Record?</DialogTitle>
                    <DialogDescription className="text-slate-500 text-sm">
                        Are you sure you want to remove the saved report for <span className="font-semibold text-slate-700">&quot;{analysisToDelete?.label}&quot;</span>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-4">
                    <Button variant="outline" className="rounded-xl" disabled={isDeleting} onClick={() => setAnalysisToDelete(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium"
                        disabled={isDeleting}
                        onClick={() => deleteHistoryItem(analysisToDelete?._id || "")}
                    >
                        {isDeleting ? "Deleting..." : "Delete Analysis"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
