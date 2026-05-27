"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthContainer from "../../components/AuthContainer";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    console.log("Signup button clicked");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      console.log(res);

      if (res.ok) {
        router.push("/login");
      } else {
        alert("Signup failed");
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContainer>

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-3 h-3 rounded-full bg-emerald-500" />

        <h1 className="text-2xl font-semibold tracking-tight">
          FinVista
        </h1>
      </div>

      {/* HEADING */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Create account
        </h2>

        <p className="text-zinc-400 mt-3">
          Start tracking your investments.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSignup}
        className="space-y-5"
      >

        {/* NAME */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Full Name
          </label>

          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Email
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Password
          </label>

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0A0A0B] border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-white text-black hover:bg-zinc-200 rounded-2xl py-3 font-medium transition"
        >
          Create Account
        </button>

      </form>

    </AuthContainer>
  );
}