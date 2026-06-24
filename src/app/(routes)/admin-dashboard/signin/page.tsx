"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eraser, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminSignIn() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/admin-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-[#1A1A18] rounded-2xl shadow-xl shadow-black/10 mb-4">
            <Eraser className="w-7 h-7 text-[#B8973A]" />
          </div>
          <h1 className="font-serif text-3xl tracking-[0.2em] uppercase text-[#1A1A18]">
            Novarease
          </h1>
          <p className="text-[10px] tracking-[0.3em] font-bold text-[#B8973A] uppercase mt-1">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#EDE9DF] border border-black/5 rounded-2xl p-8 shadow-lg">
          <h2 className="text-lg font-bold text-[#1A1A18] tracking-widest uppercase mb-1">
            Sign In
          </h2>
          <p className="text-[11px] text-[#1A1A18]/40 tracking-wide mb-8">
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A18]/50 mb-2">
                Email or Phone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full bg-[#F5F2EB] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#1A1A18] placeholder-[#1A1A18]/25 focus:outline-none focus:border-[#B8973A]/60 transition"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A18]/50 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#F5F2EB] border border-black/10 rounded-xl px-4 py-3 pr-11 text-sm text-[#1A1A18] placeholder-[#1A1A18]/25 focus:outline-none focus:border-[#B8973A]/60 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A18]/30 hover:text-[#1A1A18]/60 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-500 font-semibold tracking-wide">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A18] text-[#F5F2EB] rounded-xl py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#1A1A18]/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-[#1A1A18]/25 tracking-widest uppercase mt-8">
          Restricted Access — Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
