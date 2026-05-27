import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-28">
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-full px-4 py-2 text-sm text-zinc-400 mb-8">
          Real-time NSE & Crypto Tracking
        </div>

        <h1 className="text-7xl font-semibold tracking-tight max-w-5xl leading-[1.05]">
          Track your investments with clarity.
        </h1>

        <p className="text-zinc-400 text-xl max-w-2xl mt-8 leading-relaxed">
          Monitor Indian stocks and crypto portfolios with clean analytics,
          real-time pricing, and a modern investment dashboard.
        </p>

        <div className="flex gap-4 mt-12">
          <button className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-2xl font-medium transition">
            Start Tracking
          </button>

          <button className="border border-zinc-800 hover:border-zinc-600 px-6 py-3 rounded-2xl font-medium transition">
            View Markets
          </button>
        </div>
      </section>

      {/* MARKET CARDS */}
      <section className="px-10 pb-24">
        <div className="grid grid-cols-4 gap-5">
          {[
            ["NIFTY 50", "+1.24%"],
            ["SENSEX", "+0.89%"],
            ["BTC", "₹95,40,000"],
            ["ETH", "₹2,85,000"],
          ].map(([title, value]) => (
            <div
              key={title}
              className="bg-[#111113] border border-zinc-800 rounded-3xl p-6"
            >
              <p className="text-zinc-500 text-sm">{title}</p>

              <h3 className="text-2xl font-semibold mt-3">
                {value}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}