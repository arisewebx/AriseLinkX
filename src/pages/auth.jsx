import Login from "@/components/login";
import Signup from "@/components/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlState } from "@/context";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Shield, Users } from "lucide-react";

function Auth() {
  let [searchParams] = useSearchParams();

  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [isAuthenticated, loading]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div 
          className="absolute top-10 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{background: 'rgba(168, 85, 247, 0.3)'}}
        ></div>
        <div 
          className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{background: 'rgba(6, 182, 212, 0.3)', animationDelay: '1s'}}
        ></div>
        <div 
          className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full blur-3xl animate-pulse transform -translate-x-1/2"
          style={{background: 'rgba(59, 130, 246, 0.2)', animationDelay: '0.5s'}}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-20 left-16 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
      <div className="absolute top-32 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
      <div className="absolute bottom-40 left-24 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-12 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Brand Logo */}
          <div className="mx-auto w-20 h-20 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl w-full h-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Dynamic Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {longLink ? (
              <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Hold up! Let's login first..
              </span>
            ) : (
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome to the Future
              </span>
            )}
          </h1>
          
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            {longLink 
              ? "You need to be authenticated to continue with your link creation"
              : "Join thousands of users in our next-generation platform"
            }
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl h-16">
            <TabsTrigger 
              value="login" 
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-gray-300 font-medium transition-all duration-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/40 data-[state=active]:to-blue-500/40 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm hover:text-white hover:bg-white/5"
            >
              <Shield className="w-4 h-4" />
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-gray-300 font-medium transition-all duration-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/40 data-[state=active]:to-purple-500/40 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm hover:text-white hover:bg-white/5"
            >
              <Users className="w-4 h-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="login" className="mt-0">
            <div className="relative">
              {/* Glow effect behind login */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
              <Login />
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-0">
            <div className="relative">
              {/* Glow effect behind signup */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
              <Signup />
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)'}}>
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-gray-300 font-medium">Secure</p>
          </div>
          <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)'}}>
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-gray-300 font-medium">Fast</p>
          </div>
          <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)'}}>
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-gray-300 font-medium">Trusted</p>
          </div>
        </div>
      </div>

      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
    </div>
  );
}

export default Auth;