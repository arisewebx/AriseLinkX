import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";
import {ExternalLink, Shield, Zap, Clock, ArrowRight} from "lucide-react";

const RedirectLink = () => {
  const {id} = useParams();
  const [countdown, setCountdown] = useState(3);

  const {loading, data, fn} = useFetch(getLongUrl, id);

  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);

  // Countdown timer and redirect
  useEffect(() => {
    if (!loading && !loadingStats && data) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.location.href = data.original_url;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, loadingStats, data]);

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Loading Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              {/* Logo/Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>

              {/* Loading Bar */}
              <div className="mb-6">
                <BarLoader 
                  width="100%" 
                  color="#8b5cf6" 
                  height={4}
                  className="rounded-full"
                />
                <div className="mt-2 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 opacity-50 animate-pulse rounded-full"></div>
              </div>

              {/* Loading Text */}
              <h2 className="text-2xl font-bold text-white mb-2">
                {loading ? "Fetching Link..." : "Preparing Redirect..."}
              </h2>
              <p className="text-gray-300 mb-6">
                {loading 
                  ? "Retrieving your destination URL securely"
                  : "Recording analytics and preparing safe redirect"
                }
              </p>

              {/* Security Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-green-400" />
                  </div>
                  <span>Link verified and safe</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-blue-400" />
                  </div>
                  <span>Analytics being recorded</span>
                </div>
              </div>

              {/* Powered by */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  Powered by <span className="text-purple-400 font-semibold">LinkFlow</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data && !loading && !loadingStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          {/* Redirect Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>

              {/* Countdown */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">{countdown}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Redirect Info */}
              <h2 className="text-2xl font-bold text-white mb-3">
                Redirecting You Now!
              </h2>
              <p className="text-gray-300 mb-6">
                Taking you to your destination safely...
              </p>

              {/* Destination URL */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Destination:</span>
                </div>
                <div className="text-cyan-400 font-medium text-sm break-all">
                  {data.original_url}
                </div>
              </div>

              {/* Manual redirect button */}
              <button
                onClick={() => window.location.href = data.original_url}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Continue Manually</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Security info */}
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>Tracked</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-400" />
                  <span>Fast</span>
                </div>
              </div>

              {/* Powered by */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  Redirected by <span className="text-purple-400 font-semibold">LinkFlow</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectLink;