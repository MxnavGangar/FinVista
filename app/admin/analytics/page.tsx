import DashboardLayout from "../../../components/DashboardLayout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Analytics
        </h1>

        <p className="text-zinc-500 mt-3">
          Platform-wide investment and portfolio insights.
        </p>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-500 text-sm">
            Total Users
          </p>

          <h2 className="text-3xl font-semibold mt-4">
            2,481
          </h2>
        </div>

        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-500 text-sm">
            Assets Under Management
          </p>

          <h2 className="text-3xl font-semibold mt-4">
            ₹8.4 Cr
          </h2>
        </div>

        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-500 text-sm">
            Active Investors
          </p>

          <h2 className="text-3xl font-semibold mt-4 text-emerald-400">
            1,932
          </h2>
        </div>

      </div>

      {/* ANALYTICS GRID */}
      <div className="grid grid-cols-2 gap-6">

        {/* TOP ASSETS */}
        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-xl font-semibold mb-6">
            Top Tracked Assets
          </h3>

          <div className="space-y-5">

            {[
              ["RELIANCE", "+12.4%"],
              ["TCS", "+8.1%"],
              ["BTC", "+21.6%"],
              ["ETH", "+15.2%"],
            ].map(([asset, growth]) => (
              <div
                key={asset}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {asset}
                  </p>

                  <p className="text-zinc-500 text-sm">
                    Most tracked asset
                  </p>
                </div>

                <span className="text-emerald-400 font-medium">
                  {growth}
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* USER DISTRIBUTION */}
        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-xl font-semibold mb-6">
            Portfolio Distribution
          </h3>

          <div className="space-y-6">

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">
                  Stocks
                </span>

                <span>
                  68%
                </span>
              </div>

              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[68%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">
                  Crypto
                </span>

                <span>
                  24%
                </span>
              </div>

              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[24%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">
                  ETFs
                </span>

                <span>
                  8%
                </span>
              </div>

              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-400 w-[8%]" />
              </div>
            </div>

          </div>
        </div>

      </div>

    </DashboardLayout>
  );
}