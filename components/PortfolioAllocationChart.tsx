"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  convertCurrency,
  type ExchangeRates,
  type SupportedCurrency,
} from "@/lib/currency";

type Investment = {
  _id: string;
  assetName: string;
  quantity: number;
  currentPrice?: number;
  type: "stock" | "crypto";
};

type Props = {
  investments: Investment[];
  rates: ExchangeRates;
  selectedCurrency: SupportedCurrency;
};

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
  "#EC4899",
];

export default function PortfolioAllocationChart({
  investments,
  rates,
  selectedCurrency,
}: Props) {
  const data = investments.map((investment) => {
    const baseCurrency =
      investment.type === "crypto"
        ? "USD"
        : "INR";

    const convertedPrice = convertCurrency(
      investment.currentPrice || 0,
      baseCurrency,
      selectedCurrency,
      rates
    );

    return {
      name: investment.assetName,
      value:
        investment.quantity *
        convertedPrice,
    };
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-[#101318] p-6">
      <h2 className="text-xl font-semibold text-white">
        Portfolio Allocation
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        Distribution by current market value
      </p>

      <div className="mt-6 h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number) => [
                `${selectedCurrency} ${value.toFixed(
                  2
                )}`,
                "Value",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[
                      index % COLORS.length
                    ],
                }}
              />

              <span className="text-sm text-zinc-300">
                {item.name}
              </span>
            </div>

            <span className="text-sm text-zinc-400">
              {selectedCurrency}{" "}
              {item.value.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 0,
                }
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}