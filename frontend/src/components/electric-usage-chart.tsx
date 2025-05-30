"use client"

import { Battery, Zap } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface HourlyUsageData {
  time: string;
  regular: number;
  electric: number;
}

interface ElectricUsageChartProps {
  data?: HourlyUsageData[];
}

const defaultData: HourlyUsageData[] = [
  { time: "00:00", regular: 15, electric: 8 },
  { time: "02:00", regular: 12, electric: 6 },
  { time: "04:00", regular: 8, electric: 4 },
  { time: "06:00", regular: 25, electric: 12 },
  { time: "08:00", regular: 45, electric: 25 },
  { time: "10:00", regular: 38, electric: 22 },
  { time: "12:00", regular: 42, electric: 28 },
  { time: "14:00", regular: 48, electric: 32 },
  { time: "16:00", regular: 52, electric: 35 },
  { time: "18:00", regular: 58, electric: 38 },
  { time: "20:00", regular: 35, electric: 22 },
  { time: "22:00", regular: 28, electric: 18 },
]

const chartConfig = {
  regular: {
    label: "Regular Spots",
    color: "hsl(var(--chart-1))",
    icon: Battery,
  },
  electric: {
    label: "Electric Spots",
    color: "hsl(var(--chart-2))",
    icon: Zap,
  },
} satisfies ChartConfig

export function ElectricUsageChart({ data = defaultData }: ElectricUsageChartProps) {  return (
    <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 5,
          right: 5,
          top: 5,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="regular" fill="var(--color-regular)" radius={4} />
        <Bar dataKey="electric" fill="var(--color-electric)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
