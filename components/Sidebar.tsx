import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen border-r border-zinc-800 bg-[#111113] p-6 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            FinVista
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">

          <Link
            href="/dashboard"
            className="px-4 py-3 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/portfolio"
            className="px-4 py-3 rounded-2xl text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
          >
            Portfolio
          </Link>

          <Link
            href="/admin/dashboard"
            className="px-4 py-3 rounded-2xl text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
          >
            Admin
          </Link>
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="border border-zinc-800 rounded-2xl p-4">
        <p className="text-sm text-zinc-500">
          Logged in as
        </p>

        <h3 className="text-white font-medium mt-1">
          User
        </h3>
      </div>

    </aside>
  );
}