import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <main className="flex bg-[#0B1120] text-white min-h-screen">
      <Sidebar />

      <section className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-[#111827] p-6 rounded-2xl">
            <h2 className="text-gray-400">Total Investment</h2>
            <p className="text-3xl font-bold mt-2">₹2,45,000</p>
          </div>

          <div className="bg-[#111827] p-6 rounded-2xl">
            <h2 className="text-gray-400">Current Value</h2>
            <p className="text-3xl font-bold mt-2 text-green-400">
              ₹2,78,000
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-2xl">
            <h2 className="text-gray-400">Profit/Loss</h2>
            <p className="text-3xl font-bold mt-2 text-green-400">
              +13.4%
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}