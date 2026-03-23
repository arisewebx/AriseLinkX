import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Error from "./error";
import { login, loginWithGoogle, resetPassword } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";
import { Eye, EyeOff, ArrowRight, Mail, X, CheckCircle } from "lucide-react";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email"); return; }
    setLoading(true);
    setError("");
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
              <Mail className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Reset password</p>
              <p className="text-xs text-gray-400">We'll send a reset link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Check your inbox</p>
            <p className="text-xs text-gray-500 mb-4">
              We sent a password reset link to <span className="font-medium text-gray-700">{email}</span>
            </p>
            <Button
              onClick={onClose}
              className="w-full h-9 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">Email address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className={`h-10 border-gray-200 focus-visible:ring-orange-400 ${error ? "border-red-300" : ""}`}
                autoFocus
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <p className="text-xs text-gray-400">
              Enter the email linked to your account and we'll send you a reset link.
            </p>
            <Button
              onClick={handleSend}
              disabled={loading}
              className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg disabled:opacity-60"
            >
              {loading ? <BeatLoader size={6} color="#fff" /> : "Send reset link"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);
  const { loading: googleLoading, fn: fnGoogleLogin } = useFetch(loginWithGoogle);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data]);

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });
      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => { newErrors[err.path] = err.message; });
      setErrors(newErrors);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="space-y-4">
        {error && <Error message={error.message} />}

        {/* Google Login */}
        <Button
          onClick={() => fnGoogleLogin()}
          disabled={googleLoading || loading}
          className="w-full h-10 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-300 shadow-none rounded-lg disabled:opacity-60"
        >
          {googleLoading ? (
            <BeatLoader size={6} color="#374151" />
          ) : (
            <div className="flex items-center justify-center gap-2.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </div>
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-medium">Or continue with email</span>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700 block">Email address</label>
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`h-10 border-gray-200 focus-visible:ring-orange-400 ${errors.email ? "border-red-300" : ""}`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Password</label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`h-10 border-gray-200 focus-visible:ring-orange-400 pr-10 ${errors.password ? "border-red-300" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Submit */}
        <Button
          onClick={handleLogin}
          disabled={loading || googleLoading}
          className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg disabled:opacity-60"
        >
          {loading ? (
            <BeatLoader size={6} color="#ffffff" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </div>
    </>
  );
};

export default Login;
