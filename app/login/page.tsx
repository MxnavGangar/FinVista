import AuthContainer from "../../components/AuthContainer";
import InputField from "../../components/InputField";
import Link from "next/link";

export default function LoginPage() {
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
      <form className="space-y-5">
        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full bg-white text-black hover:bg-zinc-200 rounded-2xl py-3 font-medium transition mt-2"
        >
          Login
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