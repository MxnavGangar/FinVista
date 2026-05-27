import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-20 border-b border-zinc-800 bg-[#0A0A0B]/90 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-50">

      {/* LOGO */}
      <Link
        href="/"
        className="flex items-center gap-3"
      >
        <div className="w-3 h-3 rounded-full bg-emerald-500" />

        <h1 className="text-2xl font-semibold tracking-tight text-white">
          FinVista
        </h1>
      </Link>

      {/* NAVIGATION */}
      <div className="flex items-center gap-8">

        <Link
          href="/dashboard"
          className="text-zinc-400 hover:text-white transition"
        >
          Dashboard
        </Link>

        <Link
          href="/portfolio"
          className="text-zinc-400 hover:text-white transition"
        >
          Portfolio
        </Link>

        <Link
          href="/login"
          className="bg-white text-black hover:bg-zinc-200 px-5 py-2 rounded-xl font-medium transition"
        >
          Login
        </Link>

      </div>
    </nav>
  );
}