import { useState } from "react";
import { AuthService } from "../../services/authService";
import { User } from "../../types/platform";

interface ArtistAuthModalProps {
  onLoginSuccess: (user: User) => void;
  onGoToRegister: () => void;
  onBackToSite: () => void;
}

export function ArtistAuthModal({
  onLoginSuccess,
  onGoToRegister,
  onBackToSite,
}: ArtistAuthModalProps) {
  const [email, setEmail] = useState("artist@mannatarts.com");
  const [password, setPassword] = useState("artist2026");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { user } = await AuthService.login(email, password, "artist");
      setIsLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Invalid credentials.");
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await AuthService.resetPasswordRequest(email);
      setResetToken(token);
      setResetSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to find account.");
    }
  };

  const setDemoApproved = () => {
    setEmail("artist@mannatarts.com");
    setPassword("artist2026");
    setErrorMsg(null);
  };

  const setDemoPending = () => {
    setEmail("newartist@mannatarts.com");
    setPassword("artist2026");
    setErrorMsg(null);
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
              ARTIST PLATFORM
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

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE8DF] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EDE8DF] flex items-center justify-center text-[#C4952A] font-serif text-xl mx-auto shadow-xs">
              ✦
            </div>
            <h2
              className="font-serif text-2xl font-light text-[#1A1916]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {showForgot ? "Reset Password" : "Artist Sign In"}
            </h2>
            <p className="font-ui text-xs text-[#7A776F]">
              {showForgot
                ? "Enter your registered artist email to receive a password reset code."
                : "Sign in to manage your profile, respond to client enquiries, and update your calendar."}
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          {!showForgot && (
            <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3.5 text-xs font-ui text-[#4A4845] space-y-2">
              <p className="font-semibold text-[#1A1916] flex items-center gap-1.5 text-[11px]">
                <span>🔑</span> Quick Demo Profiles:
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={setDemoApproved}
                  className="flex-1 py-1.5 px-2.5 bg-white border border-[#EDE8DF] hover:border-[#C4952A] rounded-xl text-[10px] font-semibold text-[#1A1916] transition-all cursor-pointer"
                >
                  ✓ Approved Artist (Zakir Khan)
                </button>
                <button
                  type="button"
                  onClick={setDemoPending}
                  className="flex-1 py-1.5 px-2.5 bg-white border border-[#EDE8DF] hover:border-[#C4952A] rounded-xl text-[10px] font-semibold text-[#1A1916] transition-all cursor-pointer"
                >
                  ⏳ Pending Artist (Kabir Ensemble)
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-ui flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">
                  Artist Email Address
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
                  <label className="font-ui text-xs font-semibold text-[#1A1916]">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] font-ui text-[#C4952A] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
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
                {isLoading ? "Authenticating..." : "Sign In to Artist Portal →"}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-[#7A776F]">Don't have an artist account? </span>
                <button
                  type="button"
                  onClick={onGoToRegister}
                  className="text-xs font-semibold text-[#C4952A] hover:underline cursor-pointer"
                >
                  Join as an Artist
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {resetSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-2">
                  <p className="font-semibold">Reset code generated:</p>
                  <p className="font-mono text-sm bg-white p-2 rounded-xl text-center font-bold">
                    {resetToken}
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Use this token or password <span className="font-mono">artist2026</span> to sign in.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setResetSent(false);
                    }}
                    className="w-full mt-2 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-xl"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">
                      Your Registered Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] py-3.5 rounded-full transition-all shadow-sm cursor-pointer"
                  >
                    Send Reset Instructions
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgot(false)}
                      className="text-xs font-semibold text-[#4A4845] hover:underline cursor-pointer"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[11px] text-[#7A776F] font-ui">
        Mannat Arts Platform · Curated Performing Artist Ecosystem
      </footer>
    </div>
  );
}
