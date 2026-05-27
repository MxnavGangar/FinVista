import { ReactNode } from "react";

type AuthContainerProps = {
  children: ReactNode;
};

export default function AuthContainer({
  children,
}: AuthContainerProps) {
  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#111113] border border-zinc-800 rounded-3xl p-8">
        {children}
      </div>
    </main>
  );
}