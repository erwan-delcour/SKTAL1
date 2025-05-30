"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface OccupancyData {
  day: string;
  occupancy: number;
}

interface OccupancyChartProps {
  data?: OccupancyData[];
}

const defaultData: OccupancyData[] = [
  { day: "Monday", occupancy: 65 },
  { day: "Tuesday", occupancy: 78 },
  { day: "Wednesday", occupancy: 82 },
  { day: "Thursday", occupancy: 89 },
  { day: "Friday", occupancy: 95 },
  { day: "Saturday", occupancy: 45 },
  { day: "Sunday", occupancy: 38 },
]

const chartConfig = {
  occupancy: {
    label: "Occupancy %",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function OccupancyChart({ data = defaultData }: OccupancyChartProps) {
  // Assure-toi que nous avons bien 7 jours de données dans le bon ordre
  const expectedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let chartData = data && data.length === 7 ? data : defaultData;
  
  // Vérification que tous les jours sont présents
  const hasAllDays = expectedDays.every(day => 
    chartData.some(item => item.day === day)
  );
    if (!hasAllDays) {
    chartData = defaultData;
  }

  return (
    <div className="h-full w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}          margin={{
            left: 10,
            right: 10,
            top: 10,
            bottom: 35,
          }}
        >
        <CartesianGrid vertical={false} />        <XAxis
          dataKey="day"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={15}
          interval={0}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.slice(0, 3)}
        /><ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" formatter={(value) => [`${value}%`, "Occupancy"]} />}
        />
        <Area
          dataKey="occupancy"
          type="natural"
          fill="var(--color-occupancy)"
          fillOpacity={0.4}
          stroke="var(--color-occupancy)"        />      </AreaChart>
    </ChartContainer>
    </div>
  )
}
