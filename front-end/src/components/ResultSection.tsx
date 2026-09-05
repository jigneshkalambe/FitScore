import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { ChartRadialShape } from "./ChartRadialShape";

interface AnalysisResult {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
}

export default function ResultSection({ startOver, analysisResult }: { startOver: () => void; analysisResult: AnalysisResult | null }) {
    const score = analysisResult?.score || 0;

    const matchedSkills = analysisResult?.matchedSkills || [];

    const worthHighlighting = analysisResult?.missingSkills || [];

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-10">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-blue-500">Your FitScore results</span>

                <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl font-semibold tracking-tight text-gray-900">You are a strong match.</h2>

                        <p className="max-w-2xl text-gray-500 leading-7">We analyzed your resume and the job description you provided. Here are the results.</p>
                    </div>

                    <Button variant="outline" className="shrink-0" onClick={startOver}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Start Over
                    </Button>
                </div>
            </div>

            {/* Result Cards */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Score Card */}
                <Card className="rounded-2xl">
                    <CardContent className="p-7">
                        <div className="flex items-center gap-8">
                            <ChartRadialShape score={score} />

                            <div className="flex flex-col gap-3">
                                <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-blue-600">
                                    Great starting point
                                </Badge>

                                <h3 className="text-xl font-semibold">Your profile fits the brief.</h3>

                                <p className="text-sm leading-6 text-gray-500">
                                    You match the role's strongest signals: product thinking, collaboration, and craft. Focus your application on measurable outcomes.
                                </p>
                            </div>
                        </div>

                        <Separator className="my-7" />

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Overall fit</span>

                                <span className="text-gray-500">{score}%</span>
                            </div>

                            <Progress value={score} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* What Stood Out */}
                <Card className="rounded-2xl">
                    <CardContent className="p-7">
                        <h3 className="text-xl font-semibold">What stood out</h3>

                        {/* Matched Skills */}
                        <div className="mt-7 flex flex-col gap-3">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Matched skills</span>

                            <div className="flex flex-wrap gap-2">
                                {matchedSkills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1">
                                        ✓ {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Worth Highlighting */}
                        <div className="mt-7 flex flex-col gap-3">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Worth highlighting</span>

                            <div className="flex flex-wrap gap-2">
                                {worthHighlighting.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1">
                                        ⓘ {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Save Result */}
            <Card className="rounded-2xl bg-muted/40">
                <CardContent className="flex items-center justify-between gap-6 p-6">
                    <div>
                        <h3 className="font-semibold">Keep this result handy</h3>

                        <p className="mt-1 text-sm text-gray-500">Create a free account to save your scores and compare roles.</p>
                    </div>

                    <Button variant="outline" className="shrink-0">
                        Save result
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
