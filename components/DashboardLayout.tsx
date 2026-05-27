import { ReactNode } from "react";
import Sidebar from "./Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        {children}
      </section>
    </main>
  );
}