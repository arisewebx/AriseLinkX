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
import {login} from "@/db/apiAuth";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";
import {Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight} from "lucide-react";

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{background: 'rgba(168, 85, 247, 0.3)'}}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{background: 'rgba(6, 182, 212, 0.3)', animationDelay: '1s'}}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"
          style={{background: 'rgba(59, 130, 246, 0.2)', animationDelay: '0.5s'}}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Login Card */}
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
              <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Password
              </label>
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

            {/* Forgot Password */}
            {/* <div className="text-right">
              <button className="text-sm text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium">
                Forgot password?
              </button>
            </div> */}
          </CardContent>

          <CardFooter className="p-8 pt-4">
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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

        {/* Bottom CTA */}
        {/* <div className="text-center mt-8">
          <p className="text-gray-400">
            New here?{" "}
            <button className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200">
              Create your account
            </button>
          </p>
        </div> */}

        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-16 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default Login;