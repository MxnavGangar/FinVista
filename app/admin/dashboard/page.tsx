import DashboardLayout from "../../../components/DashboardLayout";
export default function DashboardPage() {
  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="flex items-end justify-between mb-12">

        <div>
          <p className="text-zinc-500 text-sm mb-3">
            Portfolio Overview
          </p>

          <h1 className="text-5xl font-semibold tracking-tight">
            Good evening, User.
          </h1>
        </div>

        <button className="bg-white text-black hover:bg-zinc-200 transition px-5 py-3 rounded-2xl font-medium">
          Add Investment
        </button>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6">

        {/* LARGE PORTFOLIO CARD */}
        <div className="col-span-8 bg-[#111113] border border-zinc-800 rounded-[32px] p-8">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-zinc-500 text-sm">
                Total Portfolio Value
              </p>

              <h2 className="text-6xl font-semibold tracking-tight mt-4">
                ₹2.78L
              </h2>

              <div className="flex items-center gap-3 mt-5">
                <span className="text-emerald-400 font-medium">
                  +13.4%
                </span>

                <span className="text-zinc-500">
                  This Month
                </span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm">
              Portfolio Healthy
            </div>

          </div>

          {/* FAKE CHART */}
          <div className="mt-12 h-56 rounded-3xl bg-gradient-to-b from-zinc-900 to-[#0A0A0B] border border-zinc-800 flex items-end overflow-hidden p-6">

            <div className="flex items-end gap-3 w-full h-full">

              {[35, 60, 45, 80, 55, 95, 70, 100].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-white/90 rounded-t-2xl"
                  style={{ height: `${height}%` }}
                />
              ))}

            </div>

          </div>

        </div>

        {/* SIDE METRICS */}
        <div className="col-span-4 flex flex-col gap-6">

          <div className="bg-[#111113] border border-zinc-800 rounded-[32px] p-6 flex-1">

            <p className="text-zinc-500 text-sm">
              Total Invested
            </p>

            <h3 className="text-4xl font-semibold mt-5">
              ₹2.45L
            </h3>

            <p className="text-zinc-500 mt-3">
              Across stocks and crypto
            </p>

          </div>

          <div className="bg-[#111113] border border-zinc-800 rounded-[32px] p-6 flex-1">

            <p className="text-zinc-500 text-sm">
              Best Performing Asset
            </p>

            <h3 className="text-4xl font-semibold mt-5">
              BTC
            </h3>

            <p className="text-emerald-400 mt-3">
              +21.6% growth
            </p>

          </div>

        </div>

      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-2 gap-6 mt-6">

        {/* HOLDINGS */}
        <div className="bg-[#111113] border border-zinc-800 rounded-[32px] p-8">

          <div className="flex items-center justify-between mb-8">

            <h3 className="text-2xl font-semibold">
              Top Holdings
            </h3>

            <button className="text-zinc-500 hover:text-white transition">
              View All
            </button>

          </div>

          <div className="space-y-6">

            {[
              ["RELIANCE", "₹84,000"],
              ["TCS", "₹52,000"],
              ["BTC", "₹1,24,000"],
              ["ETH", "₹48,000"],
            ].map(([asset, value]) => (
              <div
                key={asset}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-lg">
                    {asset}
                  </p>

                  <p className="text-zinc-500 text-sm">
                    Long-term holding
                  </p>
                </div>

                <span className="text-white font-medium">
                  {value}
                </span>
              </div>
            ))}

          </div>

        </div>

        {/* MARKET OVERVIEW */}
        <div className="bg-[#111113] border border-zinc-800 rounded-[32px] p-8">

          <h3 className="text-2xl font-semibold mb-8">
            Market Overview
          </h3>

          <div className="space-y-6">

            {[
              ["NIFTY 50", "+1.24%"],
              ["SENSEX", "+0.89%"],
              ["BTC", "+3.84%"],
              ["ETH", "+2.16%"],
            ].map(([market, change]) => (
              <div
                key={market}
                className="flex items-center justify-between"
              >
                <p className="text-lg">
                  {market}
                </p>

                <span className="text-emerald-400 font-medium">
                  {change}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}