import { useState } from "react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export function AdminLogin({ onLoginSuccess, onBackToSite }: AdminLoginProps) {
  const [email, setEmail] = useState("admin@stagebridge.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Accept standard demo credentials or any valid email with a 6+ char password
      if (
        (email.trim().toLowerCase() === "admin@stagebridge.com" && password === "admin123") ||
        (email.includes("@") && password.length >= 6)
      ) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError("Invalid email or password. Use demo: admin@stagebridge.com / admin123");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F6] text-[#1A1A1A] flex flex-col justify-between font-body relative overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C4952A]/08 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#9333EA]/08 blur-3xl pointer-events-none" />

      {/* Top Simple Bar */}
      <header className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full relative z-10">
        <div
          onClick={onBackToSite}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C4952A] to-[#9333EA] flex items-center justify-center shadow-md text-white font-bold text-sm">
            ⚡
          </div>
          <span className="font-display font-bold text-xl text-[#1A1A1A] tracking-tight">
            StageBridge
          </span>
          <span className="text-[9px] font-body text-[#C4952A] font-bold tracking-[0.2em] uppercase bg-[#C4952A]/10 px-1.5 py-0.5 rounded-full">
            Admin
          </span>
        </div>

        <button
          onClick={onBackToSite}
          className="text-xs font-semibold text-[#5B5B5B] hover:text-[#C4952A] bg-white border border-[#EDE8DF] hover:border-[#C4952A]/40 px-3.5 py-2 rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Back to Website</span>
        </button>
      </header>

      {/* Login Card Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#EDE8DF] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F0E8] text-[#C4952A] border border-[#EDE8DF] flex items-center justify-center text-xl mx-auto shadow-sm">
              🔐
            </div>
            <h1 className="font-display font-bold text-2xl text-[#1A1A1A]">
              Admin Authentication
            </h1>
            <p className="text-xs text-[#5B5B5B]">
              Enter your authorized management credentials to access the CMS &amp; artist controls
            </p>
          </div>

          {/* Quick Demo Credentials Callout */}
          <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3.5 text-xs text-[#5B5B5B] space-y-1">
            <div className="flex items-center justify-between text-[#9A7219] font-bold text-[11px] uppercase tracking-wider">
              <span>Demo Admin Access</span>
              <span className="text-[10px] bg-[#9A7219]/10 px-1.5 py-0.5 rounded">Pre-filled</span>
            </div>
            <div className="text-[11px]">
              Email: <span className="font-mono text-[#1A1A1A] font-semibold">admin@stagebridge.com</span>
            </div>
            <div className="text-[11px]">
              Password: <span className="font-mono text-[#1A1A1A] font-semibold">admin123</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-shake">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@stagebridge.com"
                className="w-full text-xs font-body bg-white border border-[#E5D5D8] rounded-xl px-3.5 py-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30 focus:border-[#C4952A] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#3A3A3A]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#9A7219] hover:underline cursor-pointer font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full text-xs font-body bg-white border border-[#E5D5D8] rounded-xl px-3.5 py-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30 focus:border-[#C4952A] transition-all font-mono"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#5B5B5B]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-[#C4952A] focus:ring-[#C4952A] cursor-pointer"
                />
                <span>Remember this session</span>
              </label>
              <span className="text-[11px] text-[#5B5B5B]">256-bit Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C4952A] to-[#9A7219] text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-[#5B5B5B]/70 relative z-10 border-t border-[#EDE8DF]/60 bg-white/40">
        StageBridge Pro Secure Enterprise Gateway • Authorized Personnel Only
      </footer>
    </div>
  );
}
