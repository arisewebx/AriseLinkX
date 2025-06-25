import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BeatLoader } from 'react-spinners';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import * as Yup from 'yup';

const SimpleWorkingReset = () => {
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
  const [accessToken, setAccessToken] = useState('');

  // Get access token from URL (both hash and search params)
  useEffect(() => {
    const getTokenFromUrl = () => {
      // Check hash first
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      let token = hashParams.get('access_token');
      let type = hashParams.get('type');
      
      // Fallback to search params
      if (!token) {
        const searchParams = new URLSearchParams(window.location.search);
        token = searchParams.get('access_token');
        type = searchParams.get('type');
      }
      
      console.log('Token check:', { hasToken: !!token, type });
      
      if (!token || type !== 'recovery') {
        setError('Invalid reset link. Please request a new password reset.');
        return null;
      }
      
      return token;
    };

    const token = getTokenFromUrl();
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simple fetch-based password update that works with any token
  const updatePasswordWithFetch = async (newPassword, token) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

    console.log('Attempting password update with token...');

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({
          password: newPassword
        })
      });

      const responseData = await response.json();
      console.log('API Response:', response.status, responseData);

      if (!response.ok) {
        // Try alternative endpoint if first one fails
        console.log('First attempt failed, trying alternative...');
        
        const altResponse = await fetch(`${supabaseUrl}/auth/v1/recover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            token: token,
            password: newPassword,
            type: 'recovery'
          })
        });

        const altData = await altResponse.json();
        console.log('Alternative API Response:', altResponse.status, altData);

        if (!altResponse.ok) {
          throw new Error(altData.message || responseData.message || 'Failed to update password');
        }

        return { data: altData, error: null };
      }

      return { data: responseData, error: null };
    } catch (error) {
      console.error('Fetch update error:', error);
      return { data: null, error };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      // Validate form
      const schema = Yup.object().shape({
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Please confirm your password')
      });

      await schema.validate(formData, { abortEarly: false });

      if (!accessToken) {
        throw new Error('No valid reset token found. Please request a new password reset.');
      }

      console.log('Starting password update...');
      
      const { data, error: updateError } = await updatePasswordWithFetch(formData.password, accessToken);

      if (updateError) {
        if (updateError.message?.includes('expired') || updateError.message?.includes('invalid')) {
          throw new Error('Reset link has expired. Please request a new password reset.');
        }
        throw new Error(updateError.message || 'Failed to update password');
      }

      console.log('Password updated successfully!', data);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (validationError) {
      if (validationError?.inner) {
        const newErrors = {};
        validationError.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setError(validationError.message || 'Something went wrong. Please request a new password reset.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)'}}>
          <CardHeader className="text-center pb-8 pt-12">
            <div className="mx-auto w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl w-full h-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Password Updated!
            </CardTitle>
            <p className="text-gray-300">
              Your password has been successfully updated. You'll be redirected to login in a few seconds.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl relative overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)'}}>
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-10 rounded-lg" style={{background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1), transparent, rgba(6, 182, 212, 0.1))'}}></div>
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
            Reset Password
          </CardTitle>
          <p className="text-gray-300">
            Enter your new password below
          </p>
          
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}
          
          {!accessToken && (
            <div className="mt-4">
              <Button
                onClick={() => navigate('/login')}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Request New Reset Link
              </Button>
            </div>
          )}
        </CardHeader>
        
        {accessToken && (
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none"
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
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 focus:border-cyan-500/50 focus:outline-none"
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
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <BeatLoader size={8} color="#ffffff" />
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  'Update Password'
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
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

export default SimpleWorkingReset;