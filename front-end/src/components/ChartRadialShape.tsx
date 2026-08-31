"use client";

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

export const description = "A radial chart with a custom shape";

const chartData = [{ browser: "safari", visitors: 1260, fill: "var(--color-safari)" }];

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function ChartRadialShape({ score }: { score: number }) {
    return (
        <>
            <ChartContainer config={chartConfig} className="aspect-square h-[250px]">
                <RadialBarChart data={chartData} endAngle={100} innerRadius={65} outerRadius={95}>
                    <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted" polarRadius={[86, 74]} />
                    <RadialBar dataKey="visitors" background />
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                                                {score}
                                            </tspan>
                                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                out of 100
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </PolarRadiusAxis>
                </RadialBarChart>
            </ChartContainer>
        </>
    );
}
