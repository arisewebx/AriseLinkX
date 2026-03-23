import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import { Link2, Eye, EyeOff, CheckCircle, AlertCircle, Lock } from "lucide-react";
import supabase from "@/db/supabase";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  // Supabase puts the reset token in the URL hash; we need to
  // wait for the session to be set via onAuthStateChange
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
      setChecking(false);
    });

    // Also check if already has a valid session from the link
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setValidSession(true);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    setError("");
    if (!password) { setError("Password is required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center mx-auto">
              <Link2 className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Set new password</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {checking ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Verifying reset link...</p>
            </div>
          ) : success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <p className="text-base font-semibold text-gray-900 mb-1">Password updated!</p>
              <p className="text-sm text-gray-500">Redirecting you to the dashboard...</p>
            </div>
          ) : !validSession ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-base font-semibold text-gray-900 mb-1">Invalid or expired link</p>
              <p className="text-sm text-gray-500 mb-5">
                This reset link has expired or already been used.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 h-9 rounded-lg text-sm"
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* New password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="h-10 border-gray-200 focus-visible:ring-orange-400 pl-9 pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                    onKeyPress={(e) => e.key === "Enter" && handleReset()}
                    className={`h-10 border-gray-200 focus-visible:ring-orange-400 pl-9 pr-10 ${
                      confirm && confirm !== password ? "border-red-300" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="text-xs text-red-500">Passwords don't match</p>
                )}
              </div>

              {/* Password strength hint */}
              <p className="text-xs text-gray-400">Must be at least 6 characters</p>

              <Button
                onClick={handleReset}
                disabled={loading || !password || !confirm}
                className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg disabled:opacity-60"
              >
                {loading ? <BeatLoader size={6} color="#fff" /> : "Update password"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
