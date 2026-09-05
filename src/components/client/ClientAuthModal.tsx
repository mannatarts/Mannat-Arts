import { useState } from "react";
import { AuthService } from "../../services/authService";
import { User } from "../../types/platform";

interface ClientAuthModalProps {
  onLoginSuccess: (user: User) => void;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function ClientAuthModal({
  onLoginSuccess,
  onClose,
  initialMode = "login",
}: ClientAuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("client@mannatarts.com");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("client2026");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const { user } = await AuthService.login(email, password, "client");
      setIsLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Invalid email or password.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name.trim()) { setErrorMsg("Please enter your full name."); return; }
    if (!email.includes("@")) { setErrorMsg("Please enter a valid email address."); return; }
    if (password.length < 6) { setErrorMsg("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setErrorMsg("Passwords do not match."); return; }

    setIsLoading(true);
    try {
      const { user } = await AuthService.register({
        name, email, password, phone, role: "client",
      });
      setIsLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-8 border border-[#EDE8DF] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF7F2] text-[#7A776F] hover:text-[#1A1916] flex items-center justify-center border border-[#EDE8DF] text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EDE8DF] flex items-center justify-center text-[#C4952A] font-serif text-xl mx-auto mb-3">
            M
          </div>
          <h2
            className="font-serif text-2xl font-light text-[#1A1916]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {mode === "login" ? "Client Sign In" : "Create Account"}
          </h2>
          <p className="text-xs text-[#7A776F] mt-1">
            {mode === "login"
              ? "Sign in to track your booking enquiries and artist responses."
              : "Create a free account to track all your Mannat Arts booking enquiries."}
          </p>
        </div>

        {/* Demo Access */}
        {mode === "login" && (
          <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3 text-xs mb-4">
            <p className="font-semibold text-[#1A1916] text-[11px] mb-1">🔑 Demo Client Account:</p>
            <p className="text-[10px] text-[#7A776F]">Email: <span className="font-mono text-[#1A1916]">client@mannatarts.com</span></p>
            <p className="text-[10px] text-[#7A776F]">Password: <span className="font-mono text-[#1A1916]">client2026</span></p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 ..."
                  className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-xs font-semibold bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] py-3.5 rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading
              ? "Please wait..."
              : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <div className="text-center mt-4">
          {mode === "login" ? (
            <p className="text-xs text-[#7A776F]">
              New here?{" "}
              <button
                onClick={() => { setMode("register"); setErrorMsg(null); }}
                className="font-semibold text-[#C4952A] hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#7A776F]">
              Already have an account?{" "}
              <button
                onClick={() => { setMode("login"); setErrorMsg(null); }}
                className="font-semibold text-[#C4952A] hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
