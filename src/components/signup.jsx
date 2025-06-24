import {useEffect, useState} from "react";
import Error from "./error";
import {Input} from "./ui/input";
import * as Yup from "yup";
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
import {signup} from "@/db/apiAuth";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {Eye, EyeOff, Mail, Lock, User, Upload, Image, UserPlus} from "lucide-react";

const Signup = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilepic: null,
  });

  const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    
    if (files && files[0]) {
      // Handle profile picture preview
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
      
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const {loading, error, fn: fnSignup, data} = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, loading]);

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profilepic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, {abortEarly: false});
      await fnSignup();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({api: error.message});
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <Card className="border-0 shadow-2xl relative overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)'}}>
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r opacity-10 rounded-lg" style={{background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.1), transparent, rgba(168, 85, 247, 0.1))'}}></div>
      <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
      
      <CardHeader className="text-center pb-6 pt-8 relative">
        <CardTitle className="text-2xl font-semibold text-white mb-2">
          Create Account
        </CardTitle>
        <CardDescription className="text-gray-300 text-base">
          Join us and start managing your links like a pro
        </CardDescription>
        
        {error && (
          <div className="mt-6">
            <div className="p-4 rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(10px)'}}>
              <Error message={error?.message} />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6 px-8">
        {/* Profile Picture Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <Image className="w-4 h-4 text-purple-400" />
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            {/* Profile Preview */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                {profilePreview ? (
                  <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              {profilePreview && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-20 blur-sm"></div>
              )}
            </div>
            
            {/* Upload Button */}
            <div className="flex-1">
              <label className="relative group cursor-pointer">
                <input
                  name="profilepic"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group-hover:text-white">
                  <Upload className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">
                    {formData.profilepic ? formData.profilepic.name : "Choose profile picture"}
                  </span>
                </div>
              </label>
            </div>
          </div>
          {errors.profilepic && (
            <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
              <div className="w-1 h-1 bg-red-400 rounded-full"></div>
              {errors.profilepic}
            </div>
          )}
        </div>

        {/* Name Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Full Name
          </label>
          <div className="relative group">
            <Input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 focus:border-cyan-500/50 focus:outline-none"
              style={{
                backdropFilter: 'blur(10px)',
                ...(errors.name && {borderColor: 'rgba(239, 68, 68, 0.5)'})
              }}
            />
          </div>
          {errors.name && (
            <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
              <div className="w-1 h-1 bg-red-400 rounded-full"></div>
              {errors.name}
            </div>
          )}
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
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            Password
          </label>
          <div className="relative group">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
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

        {/* Terms and Privacy */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            By creating an account, you agree to our{" "}
            <button className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
              Privacy Policy
            </button>
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-4">
        <Button
          onClick={handleSignup}
          disabled={loading}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="relative flex items-center justify-center gap-3">
            {loading ? (
              <>
                <BeatLoader size={8} color="#ffffff" />
                <span>Creating your account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;