"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthContainer from "../../components/AuthContainer";
import InputField from "../../components/InputField";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const callbackUrl =
      new URLSearchParams(window.location.search).get("callbackUrl") ||
      "/dashboard";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(result?.url || callbackUrl);
    router.refresh();
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
          Welcome back
        </h2>

        <p className="text-zinc-400 mt-3 leading-relaxed">
          Login to track your investments.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-5">
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          required
          onChange={(event) => setPassword(event.target.value)}
        />

        {error ? (
          <p className="text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black hover:bg-zinc-200 rounded-2xl py-3 font-medium transition mt-2"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-zinc-500 text-sm mt-8 text-center">
        Don’t have an account?{" "}
        <Link
  href="/signup"
  className="text-white hover:underline"
>
  Sign up
</Link>
      </p>

    </AuthContainer>
  );
}
