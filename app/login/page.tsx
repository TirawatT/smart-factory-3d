"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Eye, EyeOff, Factory, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sf-grid-bg"
      style={{ background: "#070d18" }}
    >
      {/* Glow effects */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "#00c8ff" }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "#00ff9d" }}
        />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, #0a1220 0%, #0f1d2e 100%)",
            border: "1px solid #192e48",
            boxShadow:
              "0 0 40px rgba(0,200,255,0.08), 0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
              style={{
                background: "linear-gradient(135deg, #0f2640 0%, #1a3a5c 100%)",
                border: "1px solid #1e3c60",
                boxShadow: "0 0 20px rgba(0,200,255,0.2)",
              }}
            >
              <Factory
                className="h-8 w-8"
                style={{
                  color: "#00c8ff",
                  filter: "drop-shadow(0 0 8px rgba(0,200,255,0.6))",
                }}
              />
            </div>
            <h1
              className="text-2xl font-bold tracking-widest"
              style={{
                background: "linear-gradient(135deg, #00c8ff, #00ff9d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              SMART FACTORY
            </h1>
            <p className="mt-1 text-xs" style={{ color: "#4a6d8a" }}>
              Industrial IoT Platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium"
                style={{ color: "#7fa3c2" }}
              >
                EMAIL
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: "#4a6d8a" }}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@factory.com"
                  className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-[#2d4a63]"
                  style={{
                    background: "#0b1520",
                    border: "1px solid #192e48",
                    color: "#e0ecf7",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#00c8ff";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(0,200,255,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#192e48";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium"
                style={{ color: "#7fa3c2" }}
              >
                PASSWORD
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: "#4a6d8a" }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-[#2d4a63]"
                  style={{
                    background: "#0b1520",
                    border: "1px solid #192e48",
                    color: "#e0ecf7",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#00c8ff";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(0,200,255,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#192e48";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 hover:text-[#00c8ff]"
                  style={{ color: "#4a6d8a" }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg px-4 py-2.5 text-sm"
                style={{
                  background: "rgba(255,69,96,0.1)",
                  border: "1px solid rgba(255,69,96,0.3)",
                  color: "#ff4560",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-lg py-2.5 text-sm font-bold tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading
                  ? "#0f2640"
                  : "linear-gradient(135deg, #0090c8 0%, #00c8ff 100%)",
                color: loading ? "#4a6d8a" : "#070d18",
                boxShadow: loading ? "none" : "0 0 20px rgba(0,200,255,0.3)",
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-6 rounded-lg p-4 space-y-2"
            style={{
              background: "rgba(0,200,255,0.03)",
              border: "1px solid #192e48",
            }}
          >
            <p className="text-[10px] font-medium mb-2" style={{ color: "#4a6d8a" }}>
              DEMO ACCOUNTS
            </p>
            {[
              { label: "Admin", email: "admin@factory.com", password: "Admin@123" },
              { label: "Manager", email: "manager@factory.com", password: "Manager@123" },
              { label: "Operator", email: "operator@factory.com", password: "Operator@123" },
            ].map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => {
                  setEmail(demo.email);
                  setPassword(demo.password);
                  setError("");
                }}
                className="w-full flex items-center justify-between rounded-md px-3 py-1.5 text-xs transition-all duration-200 hover:border-[#1e3c60]"
                style={{
                  background: "#0b1520",
                  border: "1px solid #192e48",
                  color: "#7fa3c2",
                }}
              >
                <span
                  className="font-medium"
                  style={{ color: "#00c8ff" }}
                >
                  {demo.label}
                </span>
                <span style={{ color: "#4a6d8a" }}>{demo.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[10px]" style={{ color: "#2d4a63" }}>
          Smart Factory Platform v1.0 · Secured Connection
        </p>
      </div>
    </div>
  );
}
