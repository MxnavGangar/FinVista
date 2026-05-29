"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: {
    date: string;
    close: number;
  }[];
};

export default function AssetChart({
  data,
}: Props) {

  return (
    <div className="h-80 w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart data={data}>

          <defs>
            <linearGradient
              id="color"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#10B981"
                stopOpacity={0.4}
              />

              <stop
                offset="100%"
                stopColor="#10B981"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            tick={false}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={false}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="close"
            stroke="#10B981"
            fill="url(#color)"
            strokeWidth={3}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}