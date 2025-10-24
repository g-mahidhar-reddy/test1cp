"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", applied: 1, completed: 0 },
  { month: "Feb", applied: 2, completed: 0 },
  { month: "Mar", applied: 3, completed: 1 },
  { month: "Apr", applied: 4, completed: 1 },
  { month: "May", applied: 3, completed: 2 },
  { month: "Jun", applied: 5, completed: 2 },
  { month: "Jul", applied: 2, completed: 3 },
  { month: "Aug", applied: 4, completed: 3 },
  { month: "Sep", applied: 1, completed: 4 },
  { month: "Oct", applied: 0, completed: 4 },
  { month: "Nov", applied: 0, completed: 5 },
  { month: "Dec", applied: 0, completed: 5 },
]

const chartConfig = {
  applied: {
    label: "Applied",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


export function OverviewChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                 <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="applied" fill="var(--color-applied)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
