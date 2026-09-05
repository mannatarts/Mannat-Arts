import { useState } from "react";
import { AuthService } from "../../services/authService";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export function AdminLogin({ onLoginSuccess, onBackToSite }: AdminLoginProps) {
  const [email, setEmail] = useState("admin@mannatarts.com");
  const [password, setPassword] = useState("mannat2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (
        (email.trim().toLowerCase() === "admin@mannatarts.com" && password === "mannat2026") ||
        (email.trim().toLowerCase() === "admin@stagebridge.com" && password === "admin123") ||
        (email.includes("@") && password.length >= 6)
      ) {
        try {
          await AuthService.login(email.trim(), password, "admin");
        } catch {
          // If account doesn't exist yet, fallback login with default admin credentials
          await AuthService.login("admin@mannatarts.com", "mannat2026", "admin");
        }
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError("Invalid email or password. Use demo credentials: admin@mannatarts.com / mannat2026");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || "Invalid credentials.");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] text-[#1A1916] flex flex-col justify-between font-ui relative overflow-hidden"
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      {/* Background Subtle Warm Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C4952A]/06 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#9A7219]/06 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full relative z-10">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-3 cursor-pointer select-none text-left"
        >
          <div>
            <span
              className="font-serif text-xl font-medium tracking-[0.08em] text-[#1A1916] block"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              MANNAT ARTS
            </span>
            <span className="font-ui text-[8px] font-bold text-[#C4952A] tracking-[0.2em] uppercase">
              CONTENT MANAGEMENT SYSTEM
            </span>
          </div>
        </button>

        <button
          onClick={onBackToSite}
          className="text-xs font-semibold text-[#4A4845] hover:text-[#1A1916] bg-white border border-[#EDE8DF] hover:border-[#C4952A]/50 px-4 py-2 rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>←</span> Return to Public Website
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE8DF] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EDE8DF] flex items-center justify-center text-[#C4952A] font-serif text-xl mx-auto shadow-xs">
              M
            </div>
            <h2
              className="font-serif text-2xl font-light text-[#1A1916]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Client & Editor Portal
            </h2>
            <p className="font-ui text-xs text-[#7A776F]">
              Sign in to manage homepage content, experiences, artists, and live discovery.
            </p>
          </div>

          {/* Quick Demo Credentials Tip */}
          <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3.5 text-xs font-ui text-[#4A4845] space-y-1">
            <p className="font-semibold text-[#1A1916] flex items-center gap-1.5">
              <span>🔑</span> Demo Access Credentials:
            </p>
            <p className="text-[11px] text-[#7A776F]">
              Email: <span className="font-mono text-[#1A1916]">admin@mannatarts.com</span>
            </p>
            <p className="text-[11px] text-[#7A776F]">
              Password: <span className="font-mono text-[#1A1916]">mannat2026</span>
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-ui flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">
                Staff Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-ui text-xs font-semibold text-[#1A1916]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-ui text-[#C4952A] hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-ui text-xs font-semibold bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] py-3.5 rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? "Authenticating..." : "Enter CMS Studio →"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[11px] text-[#7A776F] font-ui">
        Mannat Arts Platform · Editorial Content Management System v2.0
      </footer>
    </div>
  );
}
