import {Input} from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {Button} from "./ui/button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import Error from "./error";
import {login, loginWithGoogle} from "@/db/apiAuth";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";
import {Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight} from "lucide-react";
// import ForgotPasswordModal from "./ForgotPasswordModal";

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false); // New state for modal
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {loading, error, fn: fnLogin, data} = useFetch(login, formData);
  const {loading: googleLoading, fn: fnGoogleLogin} = useFetch(loginWithGoogle);
  const {fetchUser} = UrlState();

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
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, {abortEarly: false});
      await fnLogin();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  // Simple Google login handler
  const handleGoogleLogin = async () => {
    await fnGoogleLogin();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <Card className="border-0 shadow-2xl relative overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)'}}>
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-10 rounded-lg" style={{background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1), transparent, rgba(6, 182, 212, 0.1))'}}></div>
        <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
        <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        
        <CardHeader className="text-center pb-8 pt-12 relative">
          {/* Logo/Icon */}
          <div className="mx-auto w-20 h-20 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl w-full h-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Sign in to continue your journey
          </CardDescription>
          
          {error && (
            <div className="mt-6">
              <div className="p-4 rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(10px)'}}>
                <Error message={error.message} />
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6 px-8">
          {/* Google Login Button - EASY! */}
          <Button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full relative group overflow-hidden bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border border-gray-200 disabled:opacity-70"
          >
            <div className="relative flex items-center justify-center gap-3">
              {googleLoading ? (
                <>
                  <BeatLoader size={8} color="#1f2937" />
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </div>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-gray-400 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Email Address
            </label>
            <div className="relative group">
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none"
                style={{
                  backdropFilter: 'blur(10px)',
                  ...(errors.email && {borderColor: 'rgba(239, 68, 68, 0.5)'})
                }}
              />
            </div>
            {errors.email && (
              <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Password
              </label>
              {/* Forgot Password Link */}
              {/* <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium cursor-pointer relative z-10 px-2 py-1 rounded hover:bg-purple-400/10"
              >
                Forgot Password?
              </button> */}
            </div>
            <div className="relative group">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 focus:border-cyan-500/50 focus:outline-none"
                style={{
                  backdropFilter: 'blur(10px)',
                  ...(errors.password && {borderColor: 'rgba(239, 68, 68, 0.5)'})
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                {errors.password}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-4">
          <Button
            onClick={handleLogin}
            disabled={loading || googleLoading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70"
          >
            <div className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <BeatLoader size={8} color="#ffffff" />
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </div>
          </Button>
        </CardFooter>
      </Card>

      {/* Forgot Password Modal */}
      {/* <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      /> */}
    </>
  );
};

export default Login;