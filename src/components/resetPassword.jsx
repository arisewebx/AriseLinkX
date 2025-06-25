import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BeatLoader } from 'react-spinners';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, RefreshCw, ArrowLeft, Mail } from 'lucide-react';
import * as Yup from 'yup';

const UltimateResetPassword = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [supabase, setSupabase] = useState(null);
  const [user, setUser] = useState(null);

  // Initialize Supabase and set up auth state listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing Supabase auth...');
        
        // Import Supabase
        const supabaseModule = await import('@/db/supabase');
        const supabaseClient = supabaseModule.default || supabaseModule.supabase;
        setSupabase(supabaseClient);

        // Check current session first
        const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
        
        if (currentSession?.user) {
          console.log('✅ Existing session found:', currentSession.user.email);
          setUser(currentSession.user);
          setSessionReady(true);
          setCheckingSession(false);
          return;
        }

        console.log('🔍 No existing session, setting up auth listener...');

        // Set up auth state change listener to catch the session automatically
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
          console.log('🔔 Auth state change:', event, session?.user?.email);
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ User signed in via auth state change:', session.user.email);
            setUser(session.user);
            setSessionReady(true);
            setCheckingSession(false);
            setError(''); // Clear any existing errors
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('✅ Token refreshed:', session.user.email);
            setUser(session.user);
            setSessionReady(true);
          } else if (event === 'SIGNED_OUT') {
            console.log('❌ User signed out');
            setUser(null);
            setSessionReady(false);
          }
        });

        // Check if we have URL params and trigger auth automatically
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        const type = hashParams.get('type') || searchParams.get('type');

        if (!accessToken || type !== 'recovery') {
          console.log('❌ No valid reset tokens found');
          setError('Invalid reset link. Please request a new password reset.');
          setCheckingSession(false);
          return;
        }

        console.log('🔑 Valid tokens found, triggering auth...');

        // The presence of the tokens in the URL should automatically trigger Supabase auth
        // But if it doesn't work after a few seconds, we'll show an error
        setTimeout(() => {
          if (!sessionReady && !user) {
            console.log('⏰ Auth timeout, showing error');
            setError('Reset link expired or invalid. Please request a new password reset.');
            setCheckingSession(false);
          }
        }, 10000); // 10 second timeout

        // Clean up subscription on unmount
        return () => {
          subscription.unsubscribe();
        };

      } catch (err) {
        console.error('💥 Auth initialization error:', err);
        setError('Failed to initialize authentication. Please request a new password reset.');
        setCheckingSession(false);
      }
    };

    initializeAuth();
  }, [sessionReady, user]);

  // Countdown for success redirect
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
  }, [success, countdown, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = async () => {
    const schema = Yup.object().shape({
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Za-z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password')
    });

    try {
      await schema.validate(formData, { abortEarly: false });
      return { isValid: true };
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      return { isValid: false, errors: newErrors };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      // Validate form
      const validation = await validateForm();
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      if (!sessionReady || !user || !supabase) {
        throw new Error('Authentication session not ready. Please refresh and try again.');
      }

      console.log('🔄 Updating password for user:', user.email);

      // Use Supabase client directly since we have an authenticated session
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (updateError) {
        console.error('❌ Password update error:', updateError);
        
        if (updateError.message?.includes('session') || updateError.message?.includes('token')) {
          throw new Error('Your session has expired. Please request a new password reset.');
        }
        
        throw new Error(updateError.message || 'Failed to update password');
      }

      console.log('✅ Password updated successfully for:', data.user?.email);
      setSuccess(true);

    } catch (err) {
      console.error('💥 Password update failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate('/login', { state: { showForgotPassword: true } });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Loading state
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)'}}>
          <CardHeader className="text-center pb-8 pt-12">
            <div className="mx-auto w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl w-full h-full flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Authenticating Reset Link
            </CardTitle>
            <p className="text-gray-300 mb-4">
              Please wait while we securely authenticate your password reset request...
            </p>
            <p className="text-gray-400 text-sm">
              This may take a few moments as we verify your credentials.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)'}}>
          <CardHeader className="text-center pb-8 pt-12">
            <div className="mx-auto w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl w-full h-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-4">
              Password Updated Successfully!
            </CardTitle>
            <p className="text-gray-300 mb-6">
              Your password has been securely updated. You can now sign in with your new password.
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm">
                Redirecting to login in <span className="font-bold text-green-300">{countdown}</span> second{countdown !== 1 ? 's' : ''}...
              </p>
            </div>
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Continue to Login
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl relative overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)'}}>
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-10 rounded-lg animate-pulse" style={{background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1), transparent, rgba(6, 182, 212, 0.1))'}}></div>
        <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
        <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        
        <CardHeader className="text-center pb-8 pt-12 relative">
          <div className="mx-auto w-20 h-20 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-75"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl w-full h-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Create New Password
          </CardTitle>
          <p className="text-gray-300 mb-4">
            {sessionReady && user ? `Welcome back, ${user.email?.split('@')[0]}!` : 'Enter a strong password for your account'}
          </p>
          
          {sessionReady && user && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
              <p className="text-green-400 text-sm">
                ✅ Authentication successful! You can now update your password.
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-red-400 text-sm block mb-3">{error}</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={handleRefresh}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </Button>
                    <Button
                      onClick={handleRequestNewLink}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      New Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        
        {sessionReady && user && (
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Strength Indicator */}
              <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">Password Requirements</span>
                </div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li className={`flex items-center gap-2 ${formData.password.length >= 6 ? 'text-green-400' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 6 ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                    At least 6 characters
                  </li>
                  <li className={`flex items-center gap-2 ${/[A-Za-z]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Za-z]/.test(formData.password) ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                    Contains letters
                  </li>
                  <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                    Contains numbers
                  </li>
                </ul>
              </div>

              {/* New Password Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  New Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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
                  <div className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    style={{
                      backdropFilter: 'blur(10px)',
                      ...(errors.confirmPassword && {borderColor: 'rgba(239, 68, 68, 0.5)'})
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <BeatLoader size={8} color="#ffffff" />
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Update Password</span>
                  </div>
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default UltimateResetPassword;